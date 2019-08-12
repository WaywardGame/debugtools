import Doodad from "doodad/Doodad";
import { DoodadType } from "doodad/IDoodad";
import ActionExecutor from "entity/action/ActionExecutor";
import { ICorpse } from "entity/creature/corpse/ICorpse";
import Creature from "entity/creature/Creature";
import { CreatureType } from "entity/creature/ICreature";
import { EntityType } from "entity/IEntity";
import NPC from "entity/npc/NPC";
import { NPCType } from "entity/npc/NPCS";
import Player from "entity/player/Player";
import { BlockRow } from "newui/component/BlockRow";
import Button from "newui/component/Button";
import { CheckButton } from "newui/component/CheckButton";
import Dropdown, { IDropdownOption } from "newui/component/Dropdown";
import CorpseDropdown from "newui/component/dropdown/CorpseDropdown";
import CreatureDropdown from "newui/component/dropdown/CreatureDropdown";
import { DoodadDropdown } from "newui/component/dropdown/DoodadDropdown";
import NPCDropdown from "newui/component/dropdown/NPCDropdown";
import TileEventDropdown from "newui/component/dropdown/TileEventDropdown";
import { LabelledRow } from "newui/component/LabelledRow";
import { RangeRow } from "newui/component/RangeRow";
import { ITileEvent, TileEventType } from "tile/ITileEvent";
import Arrays, { Tuple } from "utilities/Arrays";
import Vector2 from "utilities/math/Vector2";
import Stream from "utilities/stream/Stream";

import SelectionExecute, { SelectionType } from "../../action/SelectionExecute";
import { DebugToolsTranslation, translation } from "../../IDebugTools";
import DebugToolsPanel from "../component/DebugToolsPanel";

const entityTypeToSelectionTypeMap = {
	[EntityType.Creature]: SelectionType.Creature,
	[EntityType.NPC]: SelectionType.NPC,
	[EntityType.Player]: SelectionType.Player,
};

function getSelectionType(target: Creature | NPC | ITileEvent | Doodad | ICorpse | Player) {
	return "entityType" in target ? entityTypeToSelectionTypeMap[target.entityType]
		: target instanceof Doodad ? SelectionType.Doodad
			: SelectionType.TileEvent;
}

export default class SelectionPanel extends DebugToolsPanel {

	private readonly creatures = new SelectionSource(game.creatures, DebugToolsTranslation.FilterCreatures,
		new CreatureDropdown("all", [["all", option => option.setText(translation(DebugToolsTranslation.SelectionAll))]]),
		(creature, filter) => filter === "all" || (creature && creature.type === CreatureType[filter as keyof typeof CreatureType]));

	private readonly npcs = new SelectionSource(game.npcs, DebugToolsTranslation.FilterNPCs,
		new NPCDropdown("all", [["all", option => option.setText(translation(DebugToolsTranslation.SelectionAll))]]),
		(npc, filter) => filter === "all" || (npc && npc.type === NPCType[filter as keyof typeof NPCType]));

	private readonly tileEvents = new SelectionSource(game.tileEvents, DebugToolsTranslation.FilterTileEvents,
		new TileEventDropdown("all", [["all", option => option.setText(translation(DebugToolsTranslation.SelectionAll))]]),
		(tileEvent, filter) => filter === "all" || (tileEvent && tileEvent.type === TileEventType[filter as keyof typeof TileEventType]));

	private readonly doodads = new SelectionSource(game.doodads, DebugToolsTranslation.FilterDoodads,
		new DoodadDropdown("all", [["all", option => option.setText(translation(DebugToolsTranslation.SelectionAll))]]),
		(doodad, filter) => filter === "all" || (doodad && doodad.type === DoodadType[filter as keyof typeof DoodadType]));

	private readonly corpses = new SelectionSource(game.corpses, DebugToolsTranslation.FilterCorpses,
		new CorpseDropdown("all", [["all", option => option.setText(translation(DebugToolsTranslation.SelectionAll))]]),
		(corpse, filter) => filter === "all" || (corpse && corpse.type === CreatureType[filter as keyof typeof CreatureType]));

	private readonly players = new SelectionSource(players, DebugToolsTranslation.FilterPlayers,
		new Dropdown()
			.setRefreshMethod(() => ({
				defaultOption: "all",
				options: Stream.of<IDropdownOption<string>[]>(["all", option => option.setText(translation(DebugToolsTranslation.SelectionAll))])
					.merge(players.map(player => Tuple(player.identifier, option => option.setText(player.getName())))),
			})),
		(player, filter) => player.identifier !== this.dropdownAlternativeTarget.selection
			&& (filter === "all" || (player && player.identifier === filter)));

	private readonly rangeQuantity = new RangeRow()
		.classes.add("debug-tools-dialog-selection-quantity")
		.setLabel(label => label.hide())
		.editRange(range => range
			.setMax(55)
			.setStep(0.01))
		.setDisplayValue(value => [{ content: `${Math.floor(1.2 ** value)}` }]);

	private readonly dropdownMethod = new Dropdown<DebugToolsTranslation>()
		.event.subscribe("selection", (_, method) => this.rangeQuantity.toggle(method !== DebugToolsTranslation.MethodAll))
		.setRefreshMethod(() => ({
			defaultOption: DebugToolsTranslation.MethodAll,
			options: [
				[DebugToolsTranslation.MethodAll, option => option.setText(translation(DebugToolsTranslation.MethodAll))],
				[DebugToolsTranslation.MethodNearest, option => option.setText(translation(DebugToolsTranslation.MethodNearest))],
				[DebugToolsTranslation.MethodRandom, option => option.setText(translation(DebugToolsTranslation.MethodRandom))],
			],
		}));

	private readonly dropdownMethodWrapper = new LabelledRow()
		.classes.add("dropdown-label")
		.setLabel(label => label.setText(translation(DebugToolsTranslation.SelectionMethod)))
		.append(this.dropdownMethod, this.rangeQuantity)
		.appendTo(this);

	private readonly dropdownAlternativeTarget = new Dropdown<string>().hide();

	private readonly dropdownAction = new Dropdown<DebugToolsTranslation>()
		.event.subscribe("selection", this.onActionChange)
		.setRefreshMethod(() => ({
			defaultOption: DebugToolsTranslation.ActionRemove,
			options: [
				[DebugToolsTranslation.ActionRemove, option => option.setText(translation(DebugToolsTranslation.ActionRemove))],
				[DebugToolsTranslation.ActionTeleportTo, option => option.setText(translation(DebugToolsTranslation.ActionTeleportTo))],
			],
		}));

	public constructor() {
		super();

		this.append(this.creatures, this.npcs, this.tileEvents, this.doodads, this.corpses, this.players);

		new BlockRow()
			.append(this.dropdownAlternativeTarget)
			.append(new LabelledRow()
				.classes.add("dropdown-label")
				.setLabel(label => label.setText(translation(DebugToolsTranslation.SelectionAction)))
				.append(this.dropdownAction))
			.appendTo(this);

		new Button()
			.setText(translation(DebugToolsTranslation.ButtonExecute))
			.event.subscribe("activate", this.execute)
			.appendTo(this);
	}

	@Override public getTranslation() {
		return DebugToolsTranslation.PanelSelection;
	}

	@Bound
	public execute() {
		const targets = Stream.of<(undefined | Creature | NPC | ITileEvent | Doodad | ICorpse | Player)[][]>(
			this.creatures.getTargetable(),
			this.npcs.getTargetable(),
			this.tileEvents.getTargetable(),
			this.doodads.getTargetable(),
			this.corpses.getTargetable(),
			this.players.getTargetable(),
		)
			.flatMap(value => Array.isArray(value) ? value : value ? [value] : [])
			.filter<undefined>(entity => !!entity)
			.toArray();

		if (!targets.length) return;

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

		ActionExecutor.get(SelectionExecute).execute(localPlayer, this.dropdownAction.selection, targets.slice(0, quantity)
			.map(target => Tuple(getSelectionType(target), target instanceof Player ? target.identifier : target.id)), this.dropdownAlternativeTarget.selection);
	}

	@Bound
	private onActionChange(_: any, action: DebugToolsTranslation) {
		switch (action) {
			case DebugToolsTranslation.ActionTeleportTo:
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
		this.dropdownMethodWrapper.classes.toggle(action === DebugToolsTranslation.ActionTeleportTo, "disabled");
		this.dropdownAlternativeTarget.toggle(action === DebugToolsTranslation.ActionTeleportTo);
	}
}

class SelectionSource<T, F> extends BlockRow {

	public readonly checkButton = new CheckButton()
		.event.subscribe("toggle", (_, checked) => this.filter.toggle(checked))
		.appendTo(this);

	private readonly filter = new LabelledRow()
		.classes.add("dropdown-label")
		.setLabel(label => label.setText(translation(DebugToolsTranslation.SelectionFilter)))
		.hide()
		.appendTo(this);

	public constructor(private readonly objectArray: T[], dTranslation: DebugToolsTranslation, private readonly dropdown: Dropdown<F>, private readonly filterPredicate: (value: T, filter: F) => any) {
		super();
		this.checkButton.setText(translation(dTranslation));
		this.filter.append(dropdown);
	}

	public getTargetable() {
		if (!this.checkButton.checked) return [];
		return this.objectArray.filter(value => this.filterPredicate(value, this.dropdown.selection));
	}
}
