/*!
 * Copyright 2011-2023 Unlok
 * https://www.unlok.ca
 *
 * Credits & Thanks:
 * https://www.unlok.ca/credits-thanks/
 *
 * Wayward is a copyrighted and licensed work. Modification and/or distribution of any source files is prohibited. If you wish to modify the game in any way, please refer to the modding guide:
 * https://github.com/WaywardGame/types/wiki
 */

import Stream from "@wayward/goodstream/Stream";
import { EventBus } from "event/EventBuses";
import { Events, IEventEmitter } from "event/EventEmitter";
import { EventHandler, OwnEventHandler } from "event/EventManager";
import Doodad from "game/doodad/Doodad";
import Corpse from "game/entity/creature/corpse/Corpse";
import Creature from "game/entity/creature/Creature";
import { EntityType } from "game/entity/IEntity";
import NPC from "game/entity/npc/NPC";
import Player from "game/entity/player/Player";
import TileEvent from "game/tile/TileEvent";
import { TextContext } from "language/ITranslation";
import Mod from "mod/Mod";
import { RendererOrigin } from "renderer/context/RendererOrigin";
import { RenderSource } from "renderer/IRenderer";
import Renderer from "renderer/Renderer";
import { BlockRow } from "ui/component/BlockRow";
import Button, { ButtonClasses } from "ui/component/Button";
import { CheckButton } from "ui/component/CheckButton";
import Component from "ui/component/Component";
import Dropdown, { IDropdownOption } from "ui/component/Dropdown";
import CorpseDropdown from "ui/component/dropdown/CorpseDropdown";
import CreatureDropdown from "ui/component/dropdown/CreatureDropdown";
import DoodadDropdown from "ui/component/dropdown/DoodadDropdown";
import NPCTypeDropdown from "ui/component/dropdown/NPCTypeDropdown";
import TileEventDropdown from "ui/component/dropdown/TileEventDropdown";
import { LabelledRow } from "ui/component/LabelledRow";
import { RangeRow } from "ui/component/RangeRow";
import Text from "ui/component/Text";
import Spacer from "ui/screen/screens/menu/component/Spacer";
import Arrays from "utilities/collection/Arrays";
import { Bound } from "utilities/Decorators";
import Math2 from "utilities/math/Math2";
import Vector2 from "utilities/math/Vector2";
import { generalRandom } from "utilities/random/RandomUtilities";
import SelectionExecute, { SelectionType } from "../../action/SelectionExecute";
import DebugTools from "../../DebugTools";
import { DebugToolsTranslation, DEBUG_TOOLS_ID, translation } from "../../IDebugTools";
import DebugToolsPanel from "../component/DebugToolsPanel";
import { IslandId } from "game/island/IIsland";
import { Tuple } from "utilities/collection/Tuple";

const entityTypeToSelectionTypeMap = {
	[EntityType.Corpse]: SelectionType.Corpse,
	[EntityType.Creature]: SelectionType.Creature,
	[EntityType.Doodad]: SelectionType.Doodad,
	[EntityType.NPC]: SelectionType.NPC,
	[EntityType.Player]: SelectionType.Player,
	[EntityType.TileEvent]: SelectionType.TileEvent,
};

type Target = Creature | NPC | TileEvent | Doodad | Corpse | Player;

function getSelectionType(target: Target) {
	return "entityType" in target ? entityTypeToSelectionTypeMap[target.entityType] : undefined;
}

export default class SelectionPanel extends DebugToolsPanel {

	@Mod.instance(DEBUG_TOOLS_ID)
	public static DEBUG_TOOLS: DebugTools;

	private readonly targets: Target[] = [];

	private readonly selectionContainer = new Component();

	private readonly textPreposition = new Text().setText(translation(DebugToolsTranslation.To)).hide();

	private readonly countRow = new LabelledRow()
		.setLabel(label => label.setText(translation(DebugToolsTranslation.LabelSelectionPreview)));

	private readonly buttonPreviewPrevious = new Button()
		.setDisplayMode(ButtonClasses.DisplayModeIcon)
		.classes.add("has-icon-before", "icon-center", "icon-left")
		.event.subscribe("activate", () => { this.previewCursor--; this.updatePreview() });

	private readonly buttonPreviewNext = new Button()
		.setDisplayMode(ButtonClasses.DisplayModeIcon)
		.classes.add("has-icon-before", "icon-center", "icon-right")
		.event.subscribe("activate", () => { this.previewCursor++; this.updatePreview() });

	private readonly previewWrapper = new Component()
		.classes.add("debug-tools-selection-preview-wrapper")
		.append(this.buttonPreviewPrevious, this.buttonPreviewNext);

	private canvas: Component<HTMLCanvasElement> | undefined;

	private readonly buttonExecute = new Button()
		.classes.add("has-icon-before", "icon-arrow-right", "icon-no-scale")
		.style.set("--icon-zoom", 2)
		.setText(translation(DebugToolsTranslation.ButtonExecute))
		.event.subscribe("activate", this.execute)
		.hide();

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

	private readonly buttonReroll = new Button()
		.classes.add("has-icon-before", "icon-dice", "icon-no-scale")
		.event.subscribe("activate", this.updateTargets)
		.hide();

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

	private targetIslandId: IslandId | undefined;

	private creatures?: SelectionSource<any, any>;
	private npcs?: SelectionSource<any, any>;
	private tileEvents?: SelectionSource<any, any>;
	private doodads?: SelectionSource<any, any>;
	private corpses?: SelectionSource<any, any>;
	private players?: SelectionSource<any, any>;

	private renderer?: Renderer;
	private previewCursor = 0;

	public constructor() {
		super();

		new BlockRow()
			.classes.add("debug-tools-selection-action")
			.append(new Component()
				.append(this.dropdownAction))
			.append(this.dropdownAlternativeTarget)
			.append(this.textPreposition)
			.appendTo(this);

		new BlockRow()
			.classes.add("debug-tools-selection-method")
			.append(this.dropdownMethod, this.rangeQuantity, this.buttonReroll)
			.appendTo(this);

		this.selectionContainer
			.appendTo(this);

		this.append(new Spacer(), this.countRow, this.buttonExecute, this.previewWrapper);

		this.updateTargets();
	}

	public override getTranslation() {
		return DebugToolsTranslation.PanelSelection;
	}

	private setupSelectionSources() {
		[this.creatures, this.npcs, this.tileEvents, this.doodads, this.corpses, this.players].forEach(a => a?.remove());

		this.creatures = new SelectionSource(localIsland.creatures.getObjects(), DebugToolsTranslation.FilterCreatures,
			new CreatureDropdown("all", [["all", option => option.setText(translation(DebugToolsTranslation.SelectionAll))]]),
			(creature, filter) => filter === "all" || (creature && creature.type === filter));

		this.npcs = new SelectionSource(localIsland.npcs.getObjects(), DebugToolsTranslation.FilterNPCs,
			new NPCTypeDropdown("all", [["all", option => option.setText(translation(DebugToolsTranslation.SelectionAll))]]),
			(npc, filter) => filter === "all" || (npc && npc.type === filter));

		this.tileEvents = new SelectionSource(localIsland.tileEvents.getObjects(), DebugToolsTranslation.FilterTileEvents,
			new TileEventDropdown("all", [["all", option => option.setText(translation(DebugToolsTranslation.SelectionAll))]]),
			(tileEvent, filter) => filter === "all" || (tileEvent && tileEvent.type === filter));

		this.doodads = new SelectionSource(localIsland.doodads.getObjects(), DebugToolsTranslation.FilterDoodads,
			new DoodadDropdown("all", [["all", option => option.setText(translation(DebugToolsTranslation.SelectionAll))]]),
			(doodad, filter) => filter === "all" || (doodad && doodad.type === filter));

		this.corpses = new SelectionSource(localIsland.corpses.getObjects(), DebugToolsTranslation.FilterCorpses,
			new CorpseDropdown("all", [["all", option => option.setText(translation(DebugToolsTranslation.SelectionAll))]]),
			(corpse, filter) => filter === "all" || (corpse && corpse.type === filter));

		this.players = new SelectionSource(game.playerManager.getAll(true, true), DebugToolsTranslation.FilterPlayers,
			new Dropdown()
				.setRefreshMethod(() => ({
					defaultOption: "all",
					options: Stream.of<IDropdownOption<string>[]>(["all", option => option.setText(translation(DebugToolsTranslation.SelectionAllPlayers))])
						.merge(game.playerManager.getAll(true, true).map(player => Tuple(player.identifier, option => option.setText(player.getName())))),
				})),
			(player, filter) => (this.dropdownAlternativeTarget.classes.has("hidden") || player.identifier !== this.dropdownAlternativeTarget.selection)
				&& (filter === "all" || (player && player.identifier === filter)),
			DebugToolsTranslation.SelectionFilterNamed);

		[this.creatures, this.npcs, this.tileEvents, this.doodads, this.corpses, this.players]
			.map(selectionSource => (selectionSource as SelectionSource<any, any>).event.subscribe("change", this.updateTargets))
			.collect(this.selectionContainer.append);
	}

	@Bound
	public execute() {
		if (!this.targets.length)
			return;

		SelectionExecute.execute(localPlayer, this.dropdownAction.selection, this.targets
			.map(target => Tuple(getSelectionType(target), target instanceof Player ? target.identifier : target.id)), this.dropdownAlternativeTarget.selection);

		this.updateTargets();
	}

	@OwnEventHandler(SelectionPanel, "append")
	protected onAppend() {
		this.getDialog()?.event.until(this, "remove").subscribe("resize", this.resize);

		this.disposeRendererAndCanvas();

		this.canvas = new Component<HTMLCanvasElement>("canvas")
			.attributes.set("width", "300")
			.attributes.set("height", "200")
			.classes.add("debug-tools-selection-preview")
			.appendTo(this.previewWrapper);

		this.renderer = new Renderer(this.canvas.element);
		this.renderer.fieldOfView.disabled = true;
		this.renderer.event.subscribe("getZoomLevel", () => 2);
		this.renderer.setOrigin(localPlayer);

		this.resize();
	}

	@OwnEventHandler(SelectionPanel, "remove")
	protected onDispose() {
		this.disposeRendererAndCanvas();
	}

	private disposeRenderer() {
		this.renderer?.delete();
		this.renderer = undefined;
	}

	private disposeRendererAndCanvas() {
		this.disposeRenderer();

		this.canvas?.remove();
		this.canvas = undefined;
	}

	@Bound
	private onActionChange(_: any, action: DebugToolsTranslation) {
		switch (action) {
			case DebugToolsTranslation.ActionTeleport:
				this.dropdownMethod.select(DebugToolsTranslation.MethodNearest);
				this.dropdownAlternativeTarget
					.setRefreshMethod(() => ({
						defaultOption: localPlayer.identifier,
						options: game.playerManager.getAll(true, true).map(player => Tuple(player.identifier, option => option.setText(player.getName()))),
					}))
					.selectDefault();
				break;

			case DebugToolsTranslation.ActionRemove:
				this.players?.checkButton.setChecked(false);
				break;
		}

		this.players?.checkButton.setDisabled(action === DebugToolsTranslation.ActionRemove);
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
		this.buttonReroll.toggle(method === DebugToolsTranslation.MethodRandom);
		this.updateTargets();
	}

	@OwnEventHandler(SelectionPanel, "switchTo")
	@EventHandler(EventBus.LocalPlayer, "loadedOnIsland")
	@Bound
	private updateTargets() {
		if (this.targetIslandId !== localPlayer.islandId) {
			this.targetIslandId = localPlayer.islandId;
			this.setupSelectionSources();
		}

		const targets = Stream.of<(Target | undefined)[][]>(
			this.creatures?.getTargetable() ?? [],
			this.npcs?.getTargetable() ?? [],
			this.tileEvents?.getTargetable() ?? [],
			this.doodads?.getTargetable() ?? [],
			this.corpses?.getTargetable() ?? [],
			this.players?.getTargetable() ?? [],
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
				generalRandom.shuffle(targets);
				break;

			case DebugToolsTranslation.MethodNearest:
				targets.sort((a, b) => Vector2.squaredDistance(a, localPlayer) - Vector2.squaredDistance(b, localPlayer));
				break;
		}

		this.targets.splice(0, Infinity);
		this.targets.push(...targets.slice(0, quantity));

		SelectionPanel.DEBUG_TOOLS.getLog().info("Targets:", this.targets);

		this.canvas?.classes.toggle(!!this.targets.length, "has-targets");
		this.buttonPreviewPrevious.toggle(this.targets.length > 1);
		this.buttonPreviewNext.toggle(this.targets.length > 1);
		this.previewCursor = 0;
		this.updatePreview();
	}

	@OwnEventHandler(SelectionPanel, "switchTo")
	@Bound
	private resize() {
		if (!this.canvas || !this.renderer) {
			return;
		}

		const box = this.canvas.getBox(true, true);
		if (box.width === 0 && box.height === 0) {
			return;
		}

		this.canvas.element.width = box.width;
		this.canvas.element.height = box.height;

		this.renderer.setViewportSize(this.canvas.element.width, this.canvas.element.height);

		this.rerender(RenderSource.Resize);
	}

	private updatePreview() {
		const which = Math2.mod(this.previewCursor, (this.targets.length || 1));
		const target = this.targets[which];
		if (!target) {
			this.countRow.dump()
				.append(new Text()
					.setText(translation(DebugToolsTranslation.SelectionPreview)
						.addArgs(0)));
			return;
		}

		this.countRow.dump()
			.append(new Text()
				.setText(translation(DebugToolsTranslation.SelectionPreview)
					.addArgs(which + 1, this.targets.length, target.getName().inContext(TextContext.Title))));

		this.renderer?.setOrigin(RendererOrigin.fromEntity(target));

		this.rerender();
	}

	private rerender(reason = RenderSource.Mod) {
		this.renderer?.updateView(reason, true);
	}

	@EventHandler(EventBus.Game, "tickEnd")
	public onTickEnd() {
		this.rerender();
	}
}

interface ISelectionSourceEvents extends Events<BlockRow> {
	change(): any;
}

class SelectionSource<T, F> extends BlockRow {
	public override readonly event: IEventEmitter<this, ISelectionSourceEvents>;

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
