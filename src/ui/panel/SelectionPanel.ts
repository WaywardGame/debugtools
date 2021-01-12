import Doodad from "doodad/Doodad";
import Corpse from "entity/creature/corpse/Corpse";
import Creature from "entity/creature/Creature";
import { EntityType } from "entity/IEntity";
import NPC from "entity/npc/NPC";
import Player from "entity/player/Player";
import { Events, IEventEmitter } from "event/EventEmitter";
import { OwnEventHandler } from "event/EventManager";
import Mod from "mod/Mod";
import { BlockRow } from "newui/component/BlockRow";
import Button from "newui/component/Button";
import { CheckButton } from "newui/component/CheckButton";
import Component from "newui/component/Component";
import Dropdown, { IDropdownOption } from "newui/component/Dropdown";
import CorpseDropdown from "newui/component/dropdown/CorpseDropdown";
import CreatureDropdown from "newui/component/dropdown/CreatureDropdown";
import { DoodadDropdown } from "newui/component/dropdown/DoodadDropdown";
import NPCDropdown from "newui/component/dropdown/NPCDropdown";
import TileEventDropdown from "newui/component/dropdown/TileEventDropdown";
import { LabelledRow } from "newui/component/LabelledRow";
import { RangeRow } from "newui/component/RangeRow";
import Text from "newui/component/Text";
import Spacer from "newui/screen/screens/menu/component/Spacer";
import DebugTools from "src/DebugTools";
import TileEvent from "tile/TileEvent";
import Arrays, { Tuple } from "utilities/Arrays";
import Vector2 from "utilities/math/Vector2";
import SelectionExecute, { SelectionType } from "../../action/SelectionExecute";
import { DebugToolsTranslation, DEBUG_TOOLS_ID, translation } from "../../IDebugTools";
import DebugToolsPanel from "../component/DebugToolsPanel";

const entityTypeToSelectionTypeMap = {
	[EntityType.Creature]: SelectionType.Creature,
	[EntityType.NPC]: SelectionType.NPC,
	[EntityType.Player]: SelectionType.Player,
};

type Target = Creature | NPC | TileEvent | Doodad | Corpse | Player;

function getSelectionType(target: Target) {
	return "entityType" in target ? entityTypeToSelectionTypeMap[target.entityType]
		: target instanceof Doodad ? SelectionType.Doodad
			: SelectionType.TileEvent;
}

export default class SelectionPanel extends DebugToolsPanel {

	@Mod.instance(DEBUG_TOOLS_ID)
	public static DEBUG_TOOLS: DebugTools;

	private readonly targets: Target[] = [];

	private readonly textPreposition = new Text().setText(translation(DebugToolsTranslation.To)).hide();

	private readonly countRow = new LabelledRow()
		.setLabel(label => label.setText(translation(DebugToolsTranslation.LabelSelectionCount)));

	private readonly buttonExecute = new Button()
		.classes.add("has-icon-before", "icon-arrow-right", "icon-no-scale")
		.setText(translation(DebugToolsTranslation.ButtonExecute))
		.event.subscribe("activate", this.execute)
		.hide();

	private readonly creatures = new SelectionSource(island.creatures, DebugToolsTranslation.FilterCreatures,
		new CreatureDropdown("all", [["all", option => option.setText(translation(DebugToolsTranslation.SelectionAll))]]),
		(creature, filter) => filter === "all" || (creature && creature.type === filter));

	private readonly npcs = new SelectionSource(island.npcs, DebugToolsTranslation.FilterNPCs,
		new NPCDropdown("all", [["all", option => option.setText(translation(DebugToolsTranslation.SelectionAll))]]),
		(npc, filter) => filter === "all" || (npc && npc.type === filter));

	private readonly tileEvents = new SelectionSource(island.tileEvents, DebugToolsTranslation.FilterTileEvents,
		new TileEventDropdown("all", [["all", option => option.setText(translation(DebugToolsTranslation.SelectionAll))]]),
		(tileEvent, filter) => filter === "all" || (tileEvent && tileEvent.type === filter));

	private readonly doodads = new SelectionSource(island.doodads, DebugToolsTranslation.FilterDoodads,
		new DoodadDropdown("all", [["all", option => option.setText(translation(DebugToolsTranslation.SelectionAll))]]),
		(doodad, filter) => filter === "all" || (doodad && doodad.type === filter));

	private readonly corpses = new SelectionSource(island.corpses, DebugToolsTranslation.FilterCorpses,
		new CorpseDropdown("all", [["all", option => option.setText(translation(DebugToolsTranslation.SelectionAll))]]),
		(corpse, filter) => filter === "all" || (corpse && corpse.type === filter));

	private readonly players = new SelectionSource(players, DebugToolsTranslation.FilterPlayers,
		new Dropdown()
			.setRefreshMethod(() => ({
				defaultOption: "all",
				options: Stream.of<IDropdownOption<string>[]>(["all", option => option.setText(translation(DebugToolsTranslation.SelectionAllPlayers))])
					.merge(players.map(player => Tuple(player.identifier, option => option.setText(player.getName())))),
			})),
		(player, filter) => player.identifier !== this.dropdownAlternativeTarget.selection
			&& (filter === "all" || (player && player.identifier === filter)),
		DebugToolsTranslation.SelectionFilterNamed);

	private readonly rangeQuantity = new RangeRow()
		.classes.add("debug-tools-dialog-selection-quantity")
		.setLabel(label => label.hide())
		.editRange(range => range
			.setMax(55)
			.setStep(0.01))
		.setDisplayValue(value => [{ content: `${Math.floor(1.2 ** value)}` }])
		.event.subscribe("change", this.updateTargets)
		.hide();

	private readonly dropdownMethod = new Dropdown<DebugToolsTranslation>()
		.setRefreshMethod(() => ({
			defaultOption: DebugToolsTranslation.MethodAll,
			options: [
				[DebugToolsTranslation.MethodAll, option => option.setText(translation(DebugToolsTranslation.MethodAll))],
				[DebugToolsTranslation.MethodNearest, option => option.setText(translation(DebugToolsTranslation.MethodNearest))],
				[DebugToolsTranslation.MethodRandom, option => option.setText(translation(DebugToolsTranslation.MethodRandom))],
			],
		}))
		.event.subscribe("selection", this.onMethodChange);

	private readonly dropdownAlternativeTarget = new Dropdown<string>().hide();

	private readonly dropdownAction = new Dropdown<DebugToolsTranslation>()
		.event.subscribe("selection", this.onActionChange)
		.setRefreshMethod(() => ({
			defaultOption: DebugToolsTranslation.ActionSelect,
			options: [
				[DebugToolsTranslation.ActionSelect, option => option.setText(translation(DebugToolsTranslation.ActionSelect))],
				[DebugToolsTranslation.ActionRemove, option => option.setText(translation(DebugToolsTranslation.ActionRemove))],
				[DebugToolsTranslation.ActionTeleport, option => option.setText(translation(DebugToolsTranslation.ActionTeleport))],
			],
		}));

	public constructor() {
		super();

		new BlockRow()
			.classes.add("debug-tools-selection-action")
			.append(new Component()
				// .append(new LabelledRow()
				// 	.classes.add("dropdown-label")
				// 	.setLabel(label => label.setText(translation(DebugToolsTranslation.SelectionAction)))
				.append(this.dropdownAction))
			.append(this.dropdownAlternativeTarget)
			.append(this.textPreposition)
			.appendTo(this);

		new BlockRow()
			// new LabelledRow()
			// 	.classes.add("dropdown-label")
			// 	.setLabel(label => label.setText(translation(DebugToolsTranslation.SelectionMethod)))
			.append(this.dropdownMethod, this.rangeQuantity)
			.appendTo(this);

		[this.creatures, this.npcs, this.tileEvents, this.doodads, this.corpses, this.players]
			.map(selectionSource => (selectionSource as SelectionSource<any, any>).event.subscribe("change", this.updateTargets))
			.collect(this.append);

		this.append(new Spacer(), this.countRow, this.buttonExecute);

		this.updateTargets();
	}

	@Override public getTranslation() {
		return DebugToolsTranslation.PanelSelection;
	}

	@Bound
	public execute() {
		if (!this.targets.length)
			return;

		SelectionExecute.execute(localPlayer, this.dropdownAction.selection, this.targets
			.map(target => Tuple(getSelectionType(target), target instanceof Player ? target.identifier : target.id)), this.dropdownAlternativeTarget.selection);

		this.updateTargets();
	}

	@Bound
	private onActionChange(_: any, action: DebugToolsTranslation) {
		switch (action) {
			case DebugToolsTranslation.ActionTeleport:
				this.dropdownMethod.select(DebugToolsTranslation.MethodNearest);
				this.dropdownAlternativeTarget
					.setRefreshMethod(() => ({
						defaultOption: localPlayer.identifier,
						options: players.map(player => Tuple(player.identifier, option => option.setText(player.getName()))),
					}))
					.selectDefault();
				break;

			case DebugToolsTranslation.ActionRemove:
				this.players.checkButton.setChecked(false);
				break;
		}

		this.players.checkButton.setDisabled(action === DebugToolsTranslation.ActionRemove);
		this.dropdownMethod.options.get(DebugToolsTranslation.MethodAll)!.setDisabled(action === DebugToolsTranslation.ActionTeleport);
		this.rangeQuantity.setDisabled(action === DebugToolsTranslation.ActionTeleport);
		this.dropdownAlternativeTarget.toggle(action === DebugToolsTranslation.ActionTeleport);
		this.textPreposition.toggle(action === DebugToolsTranslation.ActionTeleport);
		this.buttonExecute.toggle(action !== DebugToolsTranslation.ActionSelect);

		this.updateTargets();
	}

	@Bound
	private onMethodChange(_: any, method: DebugToolsTranslation) {
		this.rangeQuantity.toggle(method !== DebugToolsTranslation.MethodAll);
		this.updateTargets();
	}

	@OwnEventHandler(DebugToolsPanel, "switchTo")
	@Bound
	private updateTargets() {
		const targets = Stream.of<(Target | undefined)[][]>(
			this.creatures.getTargetable(),
			this.npcs.getTargetable(),
			this.tileEvents.getTargetable(),
			this.doodads.getTargetable(),
			this.corpses.getTargetable(),
			this.players.getTargetable(),
		)
			.flatMap(value => Arrays.arrayOr(value))
			.filter<undefined>(entity => !!entity)
			.toArray();

		let quantity = Math.floor(1.2 ** this.rangeQuantity.value);

		switch (this.dropdownMethod.selection) {
			case DebugToolsTranslation.MethodAll:
				quantity = targets.length;
				break;

			case DebugToolsTranslation.MethodRandom:
				Arrays.shuffle(targets);
				break;

			case DebugToolsTranslation.MethodNearest:
				targets.sort((a, b) => Vector2.squaredDistance(a, localPlayer) - Vector2.squaredDistance(b, localPlayer));
				break;
		}

		this.targets.splice(0, Infinity);
		this.targets.push(...targets.slice(0, quantity));

		SelectionPanel.DEBUG_TOOLS.getLog().info("Targets:", this.targets);

		this.countRow.dump()
			.append(new Text()
				.setText(translation(DebugToolsTranslation.SelectionCount)
					.addArgs(this.targets.length)));
	}
}

interface ISelectionSourceEvents extends Events<BlockRow> {
	change(): any;
}

class SelectionSource<T, F> extends BlockRow {
	@Override public readonly event: IEventEmitter<this, ISelectionSourceEvents>;

	public readonly checkButton = new CheckButton()
		.event.subscribe("toggle", (_, checked) => { this.filter.toggle(checked); this.event.emit("change"); })
		.appendTo(this);

	private readonly filter = new LabelledRow()
		.classes.add("dropdown-label")
		.setLabel(label => label.setText(() => translation((this.dropdown.selection as any) === "all" ? DebugToolsTranslation.SelectionFilterAll : this.filterLabel)))
		.hide()
		.appendTo(this);

	public constructor(private readonly objectArray: T[], dTranslation: DebugToolsTranslation, private readonly dropdown: Dropdown<F>, private readonly filterPredicate: (value: T, filter: F) => any, private readonly filterLabel = DebugToolsTranslation.SelectionFilter) {
		super();
		this.classes.add("debug-tools-dialog-selection-source");
		this.checkButton.setText(translation(dTranslation));
		this.filter.append(dropdown);
		dropdown.event.subscribe("selection", () => {
			this.event.emit("change");
			this.filter.refresh();
		});
	}

	public getTargetable() {
		if (!this.checkButton.checked)
			return [];

		return this.objectArray.filter(value => this.filterPredicate(value, this.dropdown.selection));
	}
}
