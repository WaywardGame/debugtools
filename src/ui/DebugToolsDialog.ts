import { Bindable, CreatureType, DoodadType, NPCType, TerrainType } from "Enums";
import { HookMethod, IHookHost } from "mod/IHookHost";
import { HookPriority } from "mod/IHookManager";
import { BindCatcherApi } from "newui/BindingManager";
import { BlockRow } from "newui/component/BlockRow";
import Button, { ButtonEvent } from "newui/component/Button";
import { CheckButton, CheckButtonEvent } from "newui/component/CheckButton";
import Component from "newui/component/Component";
import { ComponentEvent } from "newui/component/IComponent";
import { RangeInputEvent } from "newui/component/RangeInput";
import { RangeRow } from "newui/component/RangeRow";
import { UiApi } from "newui/INewUi";
import Dialog from "newui/screen/screens/game/component/Dialog";
import { DialogId, Edge, IDialogDescription } from "newui/screen/screens/game/Dialogs";
import IGameScreenApi from "newui/screen/screens/game/IGameScreenApi";
import Spacer from "newui/screen/screens/menu/component/Spacer";
import { compileShaders, loadShaders } from "renderer/Shaders";
import { ITile } from "tile/ITerrain";
import { TileEventType } from "tile/ITileEvent";
import Collectors from "utilities/Collectors";
import Enums from "utilities/enum/Enums";
import { IVector2 } from "utilities/math/IVector";
import Vector2 from "utilities/math/Vector2";
import Vector3 from "utilities/math/Vector3";
import Objects, { Bound } from "utilities/Objects";
import TileHelpers from "utilities/TileHelpers";
import Actions from "../Actions";
import DebugTools, { translation } from "../DebugTools";
import { DebugToolsEvent, DebugToolsTranslation, isPaintOverlay } from "../IDebugTools";
import CancelablePromise from "../util/CancelablePromise";
import { getTileId, getTilePosition } from "../util/TilePosition";
import CorpsePaint from "./paint/Corpse";
import CreaturePaint from "./paint/Creature";
import DoodadPaint from "./paint/Doodad";
import NPCPaint from "./paint/NPC";
import TerrainPaint from "./paint/Terrain";
import TileEventPaint from "./paint/TileEvent";

export interface IPaintData {
	terrain?: {
		type: TerrainType;
		tilled: boolean;
	};
	creature?: {
		type: CreatureType | "remove";
		aberrant: boolean;
	};
	npc?: {
		type: NPCType | "remove";
	};
	doodad?: {
		type: DoodadType | "remove";
	};
	corpse?: {
		type: CreatureType | "remove" | undefined;
		aberrant: boolean;
		replaceExisting: boolean;
	};
	tileEvent?: {
		type: TileEventType | "remove" | undefined;
		replaceExisting: boolean;
	};
}

export interface IPaintSection extends Component {
	getTilePaintData(): Partial<IPaintData> | undefined;
}

const paintSections: Array<new (api: UiApi) => IPaintSection> = [
	TerrainPaint,
	CreaturePaint,
	NPCPaint,
	DoodadPaint,
	CorpsePaint,
	TileEventPaint,
];

export default class DebugToolsDialog extends Dialog implements IHookHost {
	public static description: IDialogDescription = {
		minSize: {
			x: 25,
			y: 25,
		},
		size: {
			x: 25,
			y: 30,
		},
		maxSize: {
			x: 40,
			y: 70,
		},
		edges: [
			[Edge.Left, 25],
			[Edge.Bottom, 0],
		],
	};

	private get saveData() {
		return DebugTools.INSTANCE.data;
	}

	// private readonly getPlayerData: DebugTools["getPlayerData"];
	// private readonly setPlayerData: DebugTools["setPlayerData"];

	// private get saveDataGlobal() {
	// 	return DebugTools.INSTANCE.globalData;
	// }

	private readonly subpanels: Array<[DebugToolsTranslation, (component: Component) => any, Button?]>;
	private readonly subpanelLinkWrapper: Component;
	private readonly panelWrapper: Component;
	private zoomRange: RangeRow;
	private timeRange: RangeRow;
	private spectateButton: CheckButton;
	private inspectButton: CheckButton;

	private selectionPromise: CancelablePromise<Vector2> | undefined;
	private painting = false;
	private readonly paintTiles: number[] = [];
	private readonly paintSections: IPaintSection[] = [];
	private paintButton: CheckButton;

	public constructor(gsapi: IGameScreenApi, id: DialogId) {
		super(gsapi, id);
		this.classes.add("debug-tools-dialog");

		// this.getPlayerData = DebugTools.INSTANCE.getPlayerData.bind(DebugTools.INSTANCE);
		// this.setPlayerData = DebugTools.INSTANCE.setPlayerData.bind(DebugTools.INSTANCE);

		const api = gsapi.uiApi;

		this.subpanels = [
			[DebugToolsTranslation.PanelGeneral, this.showGeneralPanel],
			[DebugToolsTranslation.PanelDisplay, this.showDisplayPanel],
			[DebugToolsTranslation.PanelPaint, this.showPaintPanel],
		];

		this.subpanelLinkWrapper = new Component(api)
			.append(this.addScrollableWrapper().append(this.subpanels.map(subpanel => new Button(api)
				.classes.add("debug-tools-subpanel-link")
				.setText(translation(subpanel[0]))
				.on(ButtonEvent.Activate, this.showSubPanel(subpanel[0]))
				.schedule(subpanelButton => subpanel[2] = subpanelButton))))
			.appendTo(this.body);

		this.panelWrapper = this.addScrollableWrapper()
			.appendTo(new Component(api)
				.appendTo(this.body));

		const [name, , button] = this.subpanels.first();
		this.showSubPanel(name)(button!);

		hookManager.register(this, "DebugToolsDialog")
			.until(ComponentEvent.Remove);

		this.until(ComponentEvent.Remove)
			.bind(DebugTools.INSTANCE, DebugToolsEvent.UpdateSpectateState, () => this.spectateButton && this.spectateButton.refresh());
	}

	public getName() {
		return translation(DebugToolsTranslation.DialogTitleMain);
	}

	////////////////////////////////////
	// Hooks
	//

	@HookMethod(HookPriority.High)
	public getZoomLevel(): number | undefined {
		if (this.zoomRange) {
			this.zoomRange.refresh();
		}

		return undefined;
	}

	@HookMethod
	public onGameTickEnd() {
		if (this.timeRange) {
			this.timeRange.refresh();
		}
	}

	// tslint:disable cyclomatic-complexity
	@HookMethod(HookPriority.High)
	public onBindLoop(bindPressed: Bindable, api: BindCatcherApi) {

		if (this.painting) {
			if (api.isDown(DebugTools.INSTANCE.bindablePaint) && this.gsapi.wasMouseStartWithin()) {
				const tilePosition = renderer.screenToTile(api.mouseX, api.mouseY);
				const tile = game.getTile(tilePosition.x, tilePosition.y, localPlayer.z);

				if (TileHelpers.Overlay.add(tile, { type: DebugTools.INSTANCE.overlayPaint }, isPaintOverlay)) {
					this.updatePaintOverlay(tile, tilePosition);
				}

				const tileId = getTileId(tilePosition.x, tilePosition.y, localPlayer.z);

				if (!this.paintTiles.includes(tileId)) this.paintTiles.push(tileId);

				game.updateView(false);

				bindPressed = DebugTools.INSTANCE.bindablePaint;
			}

			if (api.isDown(DebugTools.INSTANCE.bindableErasePaint) && this.gsapi.wasMouseStartWithin()) {
				const tilePosition = renderer.screenToTile(api.mouseX, api.mouseY);
				const tile = game.getTile(tilePosition.x, tilePosition.y, localPlayer.z);

				if (TileHelpers.Overlay.remove(tile, isPaintOverlay)) {
					this.updatePaintOverlay(tile, tilePosition);
				}

				const tileId = getTileId(tilePosition.x, tilePosition.y, localPlayer.z);

				const index = this.paintTiles.indexOf(tileId);
				if (index > -1) this.paintTiles.splice(index, 1);

				game.updateView(false);

				bindPressed = DebugTools.INSTANCE.bindableErasePaint;
			}

			if (api.wasPressed(DebugTools.INSTANCE.bindableCancelPaint)) {
				this.paintButton.setChecked(false);
				bindPressed = DebugTools.INSTANCE.bindableCancelPaint;
			}

			if (api.wasPressed(DebugTools.INSTANCE.bindableClearPaint)) {
				this.clearPaint();
				bindPressed = DebugTools.INSTANCE.bindableClearPaint;
			}

			if (api.wasPressed(DebugTools.INSTANCE.bindableCompletePaint)) {
				this.completePaint();
				bindPressed = DebugTools.INSTANCE.bindableCompletePaint;
			}
		}

		return bindPressed;
	}
	// tslint:enable cyclomatic-complexity

	@HookMethod
	public canClientMove(api: BindCatcherApi): false | undefined {
		if (this.selectionPromise || this.painting) {
			return false;
		}

		return undefined;
	}

	private showSubPanel(name: DebugToolsTranslation) {
		return (link: Button) => {
			if (this.selectionPromise) {
				this.selectionPromise.cancel();
				delete this.selectionPromise;
			}

			this.painting = false;

			for (const element of this.subpanelLinkWrapper.findDescendants(".debug-tools-subpanel-link.active")) {
				element.classList.remove("active");
			}

			link.classes.add("active");

			const [, initializer] = this.subpanels.filter(([n]) => name === n).first();
			initializer(this.panelWrapper.dump());
		};
	}

	@Bound
	private showGeneralPanel(component: Component) {
		this.timeRange = new RangeRow(this.api)
			.classes.add("debug-tools-range-row-no-default-button")
			.setLabel(label => label.setText(translation(DebugToolsTranslation.LabelTime)))
			.editRange(range => range
				.setStep(0.001)
				.setMin(0)
				.setMax(1)
				.setRefreshMethod(() => game.time.getTime()))
			.setDisplayValue(time => game.time.getTranslation(time))
			.on(RangeInputEvent.Change, (_, time: number) => {
				actionManager.execute(localPlayer, Actions.get("setTime"), { object: time });
			})
			.appendTo(component);

		this.inspectButton = new CheckButton(this.api)
			.setText(translation(DebugToolsTranslation.ButtonInspect))
			.setRefreshMethod(() => !!this.selectionPromise)
			.on(CheckButtonEvent.Change, (_, checked: boolean) => {
				if (!!this.selectionPromise !== checked) {
					if (checked && DebugTools.INSTANCE.selector.selecting) return false;

					if (!checked) {
						if (this.selectionPromise && !this.selectionPromise.isResolved) {
							this.selectionPromise!.cancel();
						}

						delete this.selectionPromise;

					} else {
						this.selectionPromise = DebugTools.INSTANCE.selector.select();
						this.selectionPromise.then(this.inspectTile);
					}
				}

				return true;
			})
			.appendTo(component);

		new Button(this.api)
			.setText(translation(DebugToolsTranslation.ButtonInspectLocalPlayer))
			.on(ButtonEvent.Activate, this.inspectLocalPlayer)
			.appendTo(component);

		new Button(this.api)
			.setText(translation(DebugToolsTranslation.ButtonUnlockRecipes))
			.on(ButtonEvent.Activate, this.unlockRecipes)
			.appendTo(component);

		new Button(this.api)
			.setText(translation(DebugToolsTranslation.ButtonRemoveAllCreatures))
			.on(ButtonEvent.Activate, this.removeAllCreatures)
			.appendTo(component);

		new Button(this.api)
			.setText(translation(DebugToolsTranslation.ButtonRemoveAllNPCs))
			.on(ButtonEvent.Activate, this.removeAllNPCs)
			.appendTo(component);

		// this.spectateButton = new CheckButton(this.api)
		// 	.setText(translation(DebugToolsTranslation.ButtonSpectate))
		// 	.setRefreshMethod(() => this.getPlayerData(localPlayer, "spectating"))
		// 	.on(CheckButtonEvent.Change, (_, spectating: boolean) => DebugTools.INSTANCE.setSpectating(spectating))
		// 	.appendTo(component);
	}

	@Bound
	private async unlockRecipes() {
		const confirm = await this.api.interrupt(translation(DebugToolsTranslation.InterruptConfirmationUnlockRecipes))
			.withDescription(translation(DebugToolsTranslation.InterruptConfirmationUnlockRecipesDescription))
			.withConfirmation();

		if (!confirm) return;

		actionManager.execute(localPlayer, Actions.get("unlockRecipes"));
	}

	@Bound
	private removeAllCreatures() {
		actionManager.execute(localPlayer, Actions.get("removeAllCreatures"));
	}

	@Bound
	private removeAllNPCs() {
		actionManager.execute(localPlayer, Actions.get("removeAllNPCs"));
	}

	@Bound
	private showDisplayPanel(component: Component) {
		new CheckButton(this.api)
			.setText(translation(DebugToolsTranslation.ButtonToggleFog))
			.setRefreshMethod(() => this.saveData.fog)
			.on(CheckButtonEvent.Change, this.toggleFog)
			.appendTo(component);

		new CheckButton(this.api)
			.setText(translation(DebugToolsTranslation.ButtonToggleLighting))
			.setRefreshMethod(() => this.saveData.lighting)
			.on(CheckButtonEvent.Change, this.toggleLighting)
			.appendTo(component);

		this.zoomRange = new RangeRow(this.api)
			.classes.add("debug-tools-range-row-no-default-button")
			.setLabel(label => label.setText(translation(DebugToolsTranslation.LabelZoomLevel)))
			.editRange(range => range
				.setMin(0)
				.setMax(11)
				.setRefreshMethod(() => this.saveData.zoomLevel === undefined ? saveDataGlobal.options.zoomLevel + 3 : this.saveData.zoomLevel))
			.setDisplayValue(() => translation(DebugToolsTranslation.ZoomLevel)
				.get(DebugTools.INSTANCE.getZoomLevel() || saveDataGlobal.options.zoomLevel))
			.on(RangeInputEvent.Change, (_, value: number) => {
				this.saveData.zoomLevel = value;
				game.updateZoomLevel();
			})
			.appendTo(component);

		new CheckButton(this.api)
			.setText(translation(DebugToolsTranslation.ButtonUnlockCamera))
			.setRefreshMethod(() => DebugTools.INSTANCE.isCameraUnlocked)
			.on(CheckButtonEvent.Change, (_, checked: boolean) => DebugTools.INSTANCE.setCameraUnlocked(checked))
			.appendTo(component);

		new Button(this.api)
			.classes.add("warning")
			.setText(translation(DebugToolsTranslation.ButtonResetWebGL))
			.on(ButtonEvent.Activate, this.resetWebGL)
			.appendTo(component);

		new Button(this.api)
			.classes.add("warning")
			.setText(translation(DebugToolsTranslation.ButtonReloadShaders))
			.on(ButtonEvent.Activate, this.reloadShaders)
			.appendTo(component);
	}

	@Bound
	private showPaintPanel(component: Component) {
		this.paintSections.splice(0, Infinity);

		component.append(paintSections.values()
			.map(cls => new cls(this.api)
				.schedule(paintSection => this.paintSections.push(paintSection))));

		new Spacer(this.api).appendTo(component);

		this.paintButton = new CheckButton(this.api)
			.setText(translation(DebugToolsTranslation.ButtonPaint))
			.on<[boolean]>(CheckButtonEvent.Change, (_, paint) => {
				paintRow.toggle(this.painting = paint);
				if (!paint) this.clearPaint();
			})
			.appendTo(component);

		const paintRow = new BlockRow(this.api)
			.hide()
			.append(new Button(this.api)
				.setText(translation(DebugToolsTranslation.ButtonPaintClear))
				.on(ButtonEvent.Activate, this.clearPaint))
			.append(new Button(this.api)
				.setText(translation(DebugToolsTranslation.ButtonPaintComplete))
				.on(ButtonEvent.Activate, this.completePaint))
			.appendTo(component);
	}

	@Bound
	private completePaint() {
		const paintData: IPaintData = {};
		for (const paintSection of this.paintSections) {
			Object.assign(paintData, paintSection.getTilePaintData());
		}

		actionManager.execute(localPlayer, Actions.get("paint"), { object: [this.paintTiles, paintData] });

		this.clearPaint();
	}

	@Bound
	private clearPaint() {
		for (const tileId of this.paintTiles) {
			const position = getTilePosition(tileId);
			const tile = game.getTile(...position);
			TileHelpers.Overlay.remove(tile, isPaintOverlay);
		}

		this.paintTiles.splice(0, Infinity);

		game.updateView(false);
	}

	@Bound
	private toggleFog(_: any, fog: boolean) {
		this.saveData.fog = fog;
		DebugTools.INSTANCE.updateFog();
	}

	@Bound
	private toggleLighting(_: any, lighting: boolean) {
		this.saveData.lighting = lighting;
		actionManager.execute(localPlayer, Actions.get("updateStatsAndAttributes"));
		game.updateView(true);
	}

	@Bound
	private inspectLocalPlayer() {
		this.inspectTile(new Vector2(localPlayer));
	}

	@Bound
	private inspectTile(tilePosition?: Vector2) {
		delete this.selectionPromise;
		this.inspectButton.refresh();

		if (!tilePosition) return;

		DebugTools.INSTANCE.inspectTile(tilePosition);
	}

	@Bound
	private resetWebGL() {
		game.resetWebGL();
	}

	@Bound
	private async reloadShaders() {
		await loadShaders();

		compileShaders();
		game.updateView(true);
	}

	private updatePaintOverlay(tile: ITile, tilePosition: IVector2, updateNeighbors = true) {
		let neighborTiles: INeighborTiles | undefined;
		let connections: NeighborPosition[] | undefined;

		const isTilePainted = TileHelpers.Overlay.remove(tile, isPaintOverlay);

		if (isTilePainted) {
			neighborTiles = this.getNeighborTiles(tilePosition);
			connections = this.getPaintOverlayConnections(neighborTiles);

			const mappedTile: ISubTileMap = {
				[SubTilePosition.TopLeft]: paintTileMap[SubTilePosition.TopLeft][getId(SubTilePosition.TopLeft, ...connections)],
				[SubTilePosition.TopRight]: paintTileMap[SubTilePosition.TopRight][getId(SubTilePosition.TopRight, ...connections)],
				[SubTilePosition.BottomLeft]: paintTileMap[SubTilePosition.BottomLeft][getId(SubTilePosition.BottomLeft, ...connections)],
				[SubTilePosition.BottomRight]: paintTileMap[SubTilePosition.BottomRight][getId(SubTilePosition.BottomRight, ...connections)],
			};

			for (const subTilePosition of Enums.values(SubTilePosition)) {
				const offset = subTilePositionMap[subTilePosition];

				if (mappedTile[subTilePosition] === 4) {
					TileHelpers.Overlay.add(tile, {
						type: DebugTools.INSTANCE.overlayPaint,
						size: 8,
						offsetX: 20,
						offsetY: 4,
						spriteOffsetX: offset.x / 16,
						spriteOffsetY: offset.y / 16,
					});
					continue;
				}

				TileHelpers.Overlay.add(tile, {
					type: DebugTools.INSTANCE.overlayPaint,
					size: 8,
					offsetX: mappedTile[subTilePosition] * 16 + offset.x,
					offsetY: offset.y,
					spriteOffsetX: offset.x / 16,
					spriteOffsetY: offset.y / 16,
				});
			}
		}

		if (!updateNeighbors) return;

		neighborTiles = neighborTiles || this.getNeighborTiles(tilePosition);
		connections = connections || this.getPaintOverlayConnections(neighborTiles);

		for (const [neighborPosition, neighborTile] of Objects.values(neighborTiles)) {
			this.updatePaintOverlay(neighborTile, neighborPosition, false);
		}
	}

	private getNeighborTiles(tilePosition: IVector2): INeighborTiles {
		const vectors = getNeighborVectors(tilePosition);
		return Enums.values(NeighborPosition)
			.map<[NeighborPosition, [Vector3, ITile]]>(pos => [pos, [vectors[pos], game.getTile(...vectors[pos].xyz)]])
			.collect(Objects.create);
	}

	private getPaintOverlayConnections(neighbors: INeighborTiles) {
		return Objects.keys(neighbors)
			.filter(neighborPosition => TileHelpers.Overlay.has(neighbors[neighborPosition][1], isPaintOverlay))
			.collect(Collectors.toArray);
	}
}

function getNeighborVectors(tilePosition: IVector2) {
	return {
		[NeighborPosition.TopLeft]: new Vector3(tilePosition.x - 1, tilePosition.y - 1, localPlayer.z),
		[NeighborPosition.Top]: new Vector3(tilePosition.x, tilePosition.y - 1, localPlayer.z),
		[NeighborPosition.TopRight]: new Vector3(tilePosition.x + 1, tilePosition.y - 1, localPlayer.z),
		[NeighborPosition.Right]: new Vector3(tilePosition.x + 1, tilePosition.y, localPlayer.z),
		[NeighborPosition.BottomRight]: new Vector3(tilePosition.x + 1, tilePosition.y + 1, localPlayer.z),
		[NeighborPosition.Bottom]: new Vector3(tilePosition.x, tilePosition.y + 1, localPlayer.z),
		[NeighborPosition.BottomLeft]: new Vector3(tilePosition.x - 1, tilePosition.y + 1, localPlayer.z),
		[NeighborPosition.Left]: new Vector3(tilePosition.x - 1, tilePosition.y, localPlayer.z),
	};
}

type INeighborTiles = { [key in NeighborPosition]: [Vector3, ITile] };

enum NeighborPosition {
	TopLeft = "T",
	Top = "O",
	TopRight = "P",
	Right = "R",
	BottomRight = "B",
	Bottom = "M",
	BottomLeft = "L",
	Left = "E",
}

type ISubTileMap = { [key in SubTilePosition]: number };

enum SubTilePosition {
	TopLeft,
	TopRight,
	BottomLeft,
	BottomRight,
}

const paintTileMap = {
	[SubTilePosition.TopLeft]: {
		[""]: 0,
		[getId(SubTilePosition.TopLeft, NeighborPosition.TopLeft)]: 0,
		[getId(SubTilePosition.TopLeft, NeighborPosition.Top)]: 2,
		[getId(SubTilePosition.TopLeft, NeighborPosition.Top, NeighborPosition.TopLeft)]: 2,
		[getId(SubTilePosition.TopLeft, NeighborPosition.Left)]: 3,
		[getId(SubTilePosition.TopLeft, NeighborPosition.Left, NeighborPosition.TopLeft)]: 3,
		[getId(SubTilePosition.TopLeft, NeighborPosition.Top, NeighborPosition.Left)]: 1,
		[getId(SubTilePosition.TopLeft, NeighborPosition.Top, NeighborPosition.Left, NeighborPosition.TopLeft)]: 4,
	},
	[SubTilePosition.TopRight]: {
		[""]: 0,
		[getId(SubTilePosition.TopRight, NeighborPosition.TopRight)]: 0,
		[getId(SubTilePosition.TopRight, NeighborPosition.Top)]: 2,
		[getId(SubTilePosition.TopRight, NeighborPosition.Top, NeighborPosition.TopRight)]: 2,
		[getId(SubTilePosition.TopRight, NeighborPosition.Right)]: 3,
		[getId(SubTilePosition.TopRight, NeighborPosition.Right, NeighborPosition.TopRight)]: 3,
		[getId(SubTilePosition.TopRight, NeighborPosition.Top, NeighborPosition.Right)]: 1,
		[getId(SubTilePosition.TopRight, NeighborPosition.Top, NeighborPosition.Right, NeighborPosition.TopRight)]: 4,
	},
	[SubTilePosition.BottomLeft]: {
		[""]: 0,
		[getId(SubTilePosition.BottomLeft, NeighborPosition.BottomLeft)]: 0,
		[getId(SubTilePosition.BottomLeft, NeighborPosition.Bottom)]: 2,
		[getId(SubTilePosition.BottomLeft, NeighborPosition.Bottom, NeighborPosition.BottomLeft)]: 2,
		[getId(SubTilePosition.BottomLeft, NeighborPosition.Left)]: 3,
		[getId(SubTilePosition.BottomLeft, NeighborPosition.Left, NeighborPosition.BottomLeft)]: 3,
		[getId(SubTilePosition.BottomLeft, NeighborPosition.Bottom, NeighborPosition.Left)]: 1,
		[getId(SubTilePosition.BottomLeft, NeighborPosition.Bottom, NeighborPosition.Left, NeighborPosition.BottomLeft)]: 4,
	},
	[SubTilePosition.BottomRight]: {
		[""]: 0,
		[getId(SubTilePosition.BottomRight, NeighborPosition.BottomRight)]: 0,
		[getId(SubTilePosition.BottomRight, NeighborPosition.Bottom)]: 2,
		[getId(SubTilePosition.BottomRight, NeighborPosition.Bottom, NeighborPosition.BottomRight)]: 2,
		[getId(SubTilePosition.BottomRight, NeighborPosition.Right)]: 3,
		[getId(SubTilePosition.BottomRight, NeighborPosition.Right, NeighborPosition.BottomRight)]: 3,
		[getId(SubTilePosition.BottomRight, NeighborPosition.Bottom, NeighborPosition.Right)]: 1,
		[getId(SubTilePosition.BottomRight, NeighborPosition.Bottom, NeighborPosition.Right, NeighborPosition.BottomRight)]: 4,
	},
};

function getId(relevantFor: SubTilePosition, ...positions: Array<NeighborPosition | undefined>) {
	return positions.filter((p): p is NeighborPosition => p !== undefined && isRelevant(relevantFor, p))
		.sort((a, b) => a.localeCompare(b))
		.join("");
}

// tslint:disable cyclomatic-complexity
function isRelevant(subTilePosition: SubTilePosition, neighborPosition: NeighborPosition) {
	switch (subTilePosition) {
		case SubTilePosition.TopLeft:
			return neighborPosition === NeighborPosition.Top || neighborPosition === NeighborPosition.TopLeft || neighborPosition === NeighborPosition.Left;
		case SubTilePosition.TopRight:
			return neighborPosition === NeighborPosition.Top || neighborPosition === NeighborPosition.TopRight || neighborPosition === NeighborPosition.Right;
		case SubTilePosition.BottomLeft:
			return neighborPosition === NeighborPosition.Bottom || neighborPosition === NeighborPosition.BottomLeft || neighborPosition === NeighborPosition.Left;
		case SubTilePosition.BottomRight:
			return neighborPosition === NeighborPosition.Bottom || neighborPosition === NeighborPosition.BottomRight || neighborPosition === NeighborPosition.Right;
	}
}
// tslint:enable cyclomatic-complexity

const subTilePositionMap = {
	[SubTilePosition.TopLeft]: Vector2.ZERO,
	[SubTilePosition.TopRight]: new Vector2(8, 0),
	[SubTilePosition.BottomLeft]: new Vector2(0, 8),
	[SubTilePosition.BottomRight]: new Vector2(8),
};
