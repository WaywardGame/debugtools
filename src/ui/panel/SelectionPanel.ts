import { EventBus } from "@wayward/game/event/EventBuses";
import { EventHandler } from "@wayward/game/event/EventManager";
import type Doodad from "@wayward/game/game/doodad/Doodad";
import { EntityType } from "@wayward/game/game/entity/IEntity";
import type Creature from "@wayward/game/game/entity/creature/Creature";
import type Corpse from "@wayward/game/game/entity/creature/corpse/Corpse";
import type NPC from "@wayward/game/game/entity/npc/NPC";
import Player from "@wayward/game/game/entity/player/Player";
import type { IslandId } from "@wayward/game/game/island/IIsland";
import type Island from "@wayward/game/game/island/Island";
import type TileEvent from "@wayward/game/game/tile/TileEvent";
import { TextContext } from "@wayward/game/language/ITranslation";
import Mod from "@wayward/game/mod/Mod";
import { RenderSource, ZOOM_LEVEL_MAX, ZOOM_LEVEL_MIN } from "@wayward/game/renderer/IRenderer";
import { Renderer } from "@wayward/game/renderer/Renderer";
import { RendererOrigin } from "@wayward/game/renderer/context/RendererOrigin";
import { BlockRow } from "@wayward/game/ui/component/BlockRow";
import Button, { ButtonClasses } from "@wayward/game/ui/component/Button";
import { CheckButton } from "@wayward/game/ui/component/CheckButton";
import Component from "@wayward/game/ui/component/Component";
import type { IDropdownOption } from "@wayward/game/ui/component/Dropdown";
import Dropdown from "@wayward/game/ui/component/Dropdown";
import { LabelledRow } from "@wayward/game/ui/component/LabelledRow";
import { RangeRow } from "@wayward/game/ui/component/RangeRow";
import Text from "@wayward/game/ui/component/Text";
import CorpseDropdown from "@wayward/game/ui/component/dropdown/CorpseDropdown";
import CreatureDropdown from "@wayward/game/ui/component/dropdown/CreatureDropdown";
import DoodadDropdown from "@wayward/game/ui/component/dropdown/DoodadDropdown";
import NPCTypeDropdown from "@wayward/game/ui/component/dropdown/NPCTypeDropdown";
import TileEventDropdown from "@wayward/game/ui/component/dropdown/TileEventDropdown";
import type { IBindHandlerApi } from "@wayward/game/ui/input/Bind";
import Bind from "@wayward/game/ui/input/Bind";
import Bindable from "@wayward/game/ui/input/Bindable";
import Spacer from "@wayward/game/ui/screen/screens/menu/component/Spacer";
import type { IVector3 } from "@wayward/game/utilities/math/IVector";
import Vector2 from "@wayward/game/utilities/math/Vector2";
import Vector3 from "@wayward/game/utilities/math/Vector3";
import Stream from "@wayward/goodstream/Stream";
import { Bound, Debounce } from "@wayward/utilities/Decorators";
import Arrays from "@wayward/utilities/collection/Arrays";
import { Tuple } from "@wayward/utilities/collection/Tuple";
import type { Events, IEventEmitter } from "@wayward/utilities/event/EventEmitter";
import { Priority } from "@wayward/utilities/event/EventEmitter";
import { OwnEventHandler } from "@wayward/utilities/event/EventManager";
import Math2 from "@wayward/utilities/math/Math2";
import { generalRandom } from "@wayward/utilities/random/RandomUtilities";
import type DebugTools from "../../DebugTools";
import { DEBUG_TOOLS_ID, DebugToolsTranslation, translation } from "../../IDebugTools";
import SelectionExecute, { SelectionType } from "../../action/SelectionExecute";
import DebugToolsPanel from "../component/DebugToolsPanel";

const entityTypeToSelectionTypeMap = {
	[EntityType.Corpse]: SelectionType.Corpse,
	[EntityType.Creature]: SelectionType.Creature,
	[EntityType.Doodad]: SelectionType.Doodad,
	[EntityType.NPC]: SelectionType.NPC,
	[EntityType.Player]: SelectionType.Player,
	[EntityType.TileEvent]: SelectionType.TileEvent,
};

type Target = Creature | NPC | TileEvent | Doodad | Corpse | Player | IVector3;

function getSelectionType(target: Target): SelectionType | undefined {
	return "entityType" in target ? entityTypeToSelectionTypeMap[target.entityType]
		: "z" in target ? SelectionType.Location
			: undefined;
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
		.event.subscribe("activate", () => {
			this.previewCursor--; this.updatePreview();
		});

	private readonly buttonPreviewNext = new Button()
		.setDisplayMode(ButtonClasses.DisplayModeIcon)
		.classes.add("has-icon-before", "icon-center", "icon-right")
		.event.subscribe("activate", () => {
			this.previewCursor++; this.updatePreview();
		});

	private readonly previewWrapper = new Component()
		.classes.add("debug-tools-selection-preview-wrapper")
		.append(this.buttonPreviewPrevious, this.buttonPreviewNext);

	private canvas: Component<HTMLCanvasElement> | undefined;

	private zoomLevel = 2;

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
	private treasure?: SelectionSource<any, any>;

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

	public override getTranslation(): DebugToolsTranslation {
		return DebugToolsTranslation.PanelSelection;
	}

	private setupSelectionSources(): void {
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
					options: Stream.of<Array<IDropdownOption<string>>>(["all", option => option.setText(translation(DebugToolsTranslation.SelectionAllPlayers))])
						.merge(game.playerManager.getAll(true, true).map(player => Tuple(player.identifier, option => option.setText(player.getName())))),
				})),
			(player, filter) => (this.dropdownAlternativeTarget.classes.has("hidden") || player.identifier !== this.dropdownAlternativeTarget.selection)
				&& (filter === "all" || (player && player.identifier === filter)),
			DebugToolsTranslation.SelectionFilterNamed);

		this.treasure = new SelectionSource(
			localIsland.treasureMaps
				.flatMap(map => map.getTreasure()
					.map(treasure => new Vector3(treasure, map.position.z))),
			DebugToolsTranslation.FilterTreasure);

		[this.creatures, this.npcs, this.tileEvents, this.doodads, this.corpses, this.players, this.treasure]
			.map(selectionSource => (selectionSource as SelectionSource<any, any>).event.subscribe("change", this.updateTargets))
			.collect(this.selectionContainer.append);
	}

	@Bound
	public execute(): void {
		if (!this.targets.length) {
			return;
		}

		void SelectionExecute.execute(localPlayer,
			this.dropdownAction.selectedOption,
			this.targets.map(target => Tuple(
				getSelectionType(target),
				target instanceof Player ? target.identifier
					: "entityType" in target ? target.id
						: `${target.x},${target.y},${target.z}`)),
			this.dropdownAlternativeTarget.selectedOption);

		this.updateTargets();
	}

	@OwnEventHandler(SelectionPanel, "append")
	protected async onAppend(): Promise<void> {
		this.getDialog()?.event.until(this, "switchAway", "remove")
			.subscribe("resize", () => this.resize());

		this.disposeRendererAndCanvas();

		this.renderer = await Renderer.create(() => {
			this.canvas?.remove();
			this.canvas = new Component<HTMLCanvasElement>("canvas")
				.attributes.set("width", "300")
				.attributes.set("height", "200")
				.classes.add("debug-tools-selection-preview")
				.appendTo(this.previewWrapper);
			return this.canvas.element;
		});
		this.renderer.fieldOfView.disabled = true;
		this.renderer.event.subscribe("getZoomLevel", () => this.zoomLevel);
		this.renderer.setOrigin(localPlayer);

		this.resize();
	}

	@OwnEventHandler(SelectionPanel, "switchTo")
	protected onSwitchTo(): void {
		this.resize();

		Bind.registerHandlers(this);
	}

	@OwnEventHandler(SelectionPanel, "switchAway")
	@OwnEventHandler(SelectionPanel, "remove")
	protected onSwitchAway(): void {
		Bind.deregisterHandlers(this);
	}

	@OwnEventHandler(SelectionPanel, "remove")
	protected onDispose(): void {
		this.disposeRendererAndCanvas();
	}

	private disposeRenderer(): void {
		void this.renderer?.delete();
		this.renderer = undefined;
	}

	private disposeRendererAndCanvas(): void {
		this.disposeRenderer();

		this.canvas?.remove();
		this.canvas = undefined;
	}

	@Bound
	private onActionChange(_: any, action: DebugToolsTranslation): void {
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
		this.treasure?.checkButton.setDisabled(action === DebugToolsTranslation.ActionRemove);
		this.dropdownMethod.options.get(DebugToolsTranslation.MethodAll)!.setDisabled(action === DebugToolsTranslation.ActionTeleport);
		this.rangeQuantity.setDisabled(action === DebugToolsTranslation.ActionTeleport);
		this.dropdownAlternativeTarget.toggle(action === DebugToolsTranslation.ActionTeleport);
		this.textPreposition.toggle(action === DebugToolsTranslation.ActionTeleport);
		this.buttonExecute.toggle(action !== DebugToolsTranslation.ActionSelect);

		this.updateTargets();
	}

	@Bound
	private onMethodChange(_: any, method: DebugToolsTranslation): void {
		this.rangeQuantity.toggle(method !== DebugToolsTranslation.MethodAll);
		this.buttonReroll.toggle(method === DebugToolsTranslation.MethodRandom);
		this.updateTargets();
	}

	@OwnEventHandler(SelectionPanel, "switchTo")
	@EventHandler(EventBus.LocalPlayer, "loadedOnIsland")
	@Bound
	private updateTargets(): void {
		if (this.targetIslandId !== localPlayer.islandId) {
			this.targetIslandId = localPlayer.islandId;
			this.setupSelectionSources();
		}

		let targets = Stream.of<Array<Array<Target | undefined>>>(
			this.creatures?.getTargetable() ?? [],
			this.npcs?.getTargetable() ?? [],
			this.tileEvents?.getTargetable() ?? [],
			this.doodads?.getTargetable() ?? [],
			this.corpses?.getTargetable() ?? [],
			this.players?.getTargetable() ?? [],
			this.treasure?.getTargetable() ?? [],
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
				targets = generalRandom.shuffle(targets);
				break;

			case DebugToolsTranslation.MethodNearest:
				targets.sort((a, b) => Vector2.squaredDistance(a, localPlayer) - Vector2.squaredDistance(b, localPlayer));
				break;
		}

		this.targets.splice(0, Infinity);
		this.targets.push(...targets.slice(0, quantity));

		SelectionPanel.DEBUG_TOOLS.log.info("Targets:", this.targets);

		this.previewWrapper.classes.toggle(!!this.targets.length, "has-targets");
		this.buttonPreviewPrevious.toggle(this.targets.length > 1);
		this.buttonPreviewNext.toggle(this.targets.length > 1);
		this.previewCursor = 0;
		this.updatePreview();
	}

	@Debounce(250)
	private resize(): void {
		if (!this.canvas || !this.renderer) {
			return;
		}

		const box = this.canvas.getBox(true, true);
		if (box.width === 0 && box.height === 0) {
			return;
		}

		this.canvas.element.width = Math.round(box.width);
		this.canvas.element.height = Math.round(box.height);

		this.renderer.setViewportSize(this.canvas.element.width, this.canvas.element.height);

		this.rerender(RenderSource.Resize);
	}

	@Bind.onDown(Bindable.GameZoomIn, Priority.High)
	@Bind.onDown(Bindable.GameZoomOut, Priority.High)
	public onZoomIn(api: IBindHandlerApi): boolean {
		if (api.mouse.isWithin(this.canvas)) {
			this.zoomLevel = Math.max(Math.min(this.zoomLevel + (api.bindable === Bindable.GameZoomIn ? 1 : -1), ZOOM_LEVEL_MAX), ZOOM_LEVEL_MIN);
			this.renderer?.updateZoomLevel();

			api.preventDefault = true;
			return true;
		}

		return false;
	}

	private updatePreview(): void {
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
					.addArgs(which + 1, this.targets.length, "entityType" in target ? target.getName().inContext(TextContext.Title) : `${target.x}, ${target.y}, ${target.z}`)));

		this.renderer?.setOrigin("entityType" in target ? RendererOrigin.fromEntity(target) : new RendererOrigin(localIsland.id, target.x, target.y, target.z));

		this.rerender();
	}

	private rerender(reason = RenderSource.Mod): void {
		this.renderer?.updateView(reason, true);
	}

	@EventHandler(EventBus.Island, "tickEnd")
	public onTickEnd(island: Island): void {
		if (island.isLocalIsland) {
			this.rerender();
		}
	}
}

interface ISelectionSourceEvents extends Events<BlockRow> {
	change(): any;
}

class SelectionSource<T, F> extends BlockRow {
	declare public event: IEventEmitter<this, ISelectionSourceEvents>;

	public readonly checkButton = new CheckButton()
		.event.subscribe("toggle", (_, checked) => {
			this.filter.toggle(checked); this.event.emit("change");
		})
		.appendTo(this);

	private readonly filter = new LabelledRow()
		.classes.add("dropdown-label")
		.setLabel(label => label.setText(() => translation((this.dropdown?.selection as any) === "all" ? DebugToolsTranslation.SelectionFilterAll : this.filterLabel)))
		.hide();

	public constructor(private readonly objectArray: T[], dTranslation: DebugToolsTranslation, private readonly dropdown?: Dropdown<F>, private readonly filterPredicate?: (value: T, filter?: F) => any, private readonly filterLabel = DebugToolsTranslation.SelectionFilter) {
		super();
		this.classes.add("debug-tools-dialog-selection-source");
		this.checkButton.setText(translation(dTranslation));

		if (dropdown) {
			this.filter.appendTo(this);
		}

		this.filter.append(dropdown);

		dropdown?.event.subscribe("selection", () => {
			this.event.emit("change");
			this.filter.refresh();
		});
	}

	public getTargetable(): T[] {
		if (!this.checkButton.checked) {
			return [];
		}

		return this.objectArray.filter(value => this.filterPredicate?.(value, this.dropdown?.selectedOption) ?? true);
	}
}
