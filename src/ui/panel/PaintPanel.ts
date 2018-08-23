import { Bindable, CreatureType, DoodadType, NPCType, TerrainType } from "Enums";
import { HookMethod } from "mod/IHookHost";
import { HookPriority } from "mod/IHookManager";
import { BindCatcherApi, bindingManager } from "newui/BindingManager";
import { BlockRow } from "newui/component/BlockRow";
import Button, { ButtonEvent } from "newui/component/Button";
import { CheckButton, CheckButtonEvent } from "newui/component/CheckButton";
import Component from "newui/component/Component";
import ContextMenu from "newui/component/ContextMenu";
import { UiApi } from "newui/INewUi";
import { ScreenId } from "newui/screen/IScreen";
import IGameScreenApi from "newui/screen/screens/game/IGameScreenApi";
import Spacer from "newui/screen/screens/menu/component/Spacer";
import { ITile } from "tile/ITerrain";
import { TileEventType } from "tile/ITileEvent";
import Collectors from "utilities/Collectors";
import Enums from "utilities/enum/Enums";
import { IVector2 } from "utilities/math/IVector";
import Vector2 from "utilities/math/Vector2";
import Vector3 from "utilities/math/Vector3";
import Objects, { Bound } from "utilities/Objects";
import TileHelpers from "utilities/TileHelpers";
import Actions from "../../Actions";
import DebugTools, { translation } from "../../DebugTools";
import { DebugToolsTranslation, isPaintOverlay } from "../../IDebugTools";
import { getTileId, getTilePosition } from "../../util/TilePosition";
import DebugToolsPanel, { DebugToolsPanelEvent } from "../component/DebugToolsPanel";
import CorpsePaint from "../paint/Corpse";
import CreaturePaint from "../paint/Creature";
import DoodadPaint from "../paint/Doodad";
import NPCPaint from "../paint/NPC";
import TerrainPaint from "../paint/Terrain";
import TileEventPaint from "../paint/TileEvent";

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
	isChanging(): boolean;
	reset(): void;
	getTilePaintData(): Partial<IPaintData> | undefined;
}

const paintSections: (new (api: UiApi) => IPaintSection)[] = [
	TerrainPaint,
	CreaturePaint,
	NPCPaint,
	DoodadPaint,
	CorpsePaint,
	TileEventPaint,
];

export default class PaintPanel extends DebugToolsPanel {
	private painting = false;
	private readonly paintTiles: number[] = [];
	private readonly paintSections: IPaintSection[] = [];
	private paintButton: CheckButton;
	private paintRow: Component;

	public constructor(gsapi: IGameScreenApi) {
		super(gsapi);

		this.paintSections.splice(0, Infinity);

		this.paintSections.push(...paintSections
			.map(cls => new cls(this.api)
				.appendTo(this)));

		new Spacer(this.api).appendTo(this);

		this.paintRow = new BlockRow(this.api)
			.classes.add("debug-tools-paint-row")
			.append(this.paintButton = new CheckButton(this.api)
				.setText(translation(DebugToolsTranslation.ButtonPaint))
				.on<[boolean]>(CheckButtonEvent.Change, (_, paint) => {
					this.paintRow.classes.toggle(this.painting = paint, "painting");
					if (!paint) this.clearPaint();
				}))
			.append(new Button(this.api)
				.setText(translation(DebugToolsTranslation.ButtonPaintClear))
				.setTooltip(tooltip => tooltip.addText(text => text.setText(translation(DebugToolsTranslation.TooltipPaintClear))))
				.on(ButtonEvent.Activate, this.clearPaint))
			.append(new Button(this.api)
				.setText(translation(DebugToolsTranslation.ButtonPaintComplete))
				.setTooltip(tooltip => tooltip.addText(text => text.setText(translation(DebugToolsTranslation.TooltipPaintComplete))))
				.on(ButtonEvent.Activate, this.completePaint));

		this.on(DebugToolsPanelEvent.SwitchTo, this.onSwitchTo);
		this.on(DebugToolsPanelEvent.SwitchAway, this.onSwitchAway);
	}

	public getTranslation() {
		return DebugToolsTranslation.PanelPaint;
	}

	@HookMethod
	public canClientMove(api: BindCatcherApi): false | undefined {
		if (this.painting) return false;

		return undefined;
	}

	// tslint:disable cyclomatic-complexity
	@HookMethod(HookPriority.High)
	public onBindLoop(bindPressed: Bindable, api: BindCatcherApi) {

		if (api.wasPressed(Bindable.MenuContextMenu) && !bindPressed) {
			for (const paintSection of this.paintSections) {
				if (paintSection.isChanging() && api.isMouseWithin(paintSection)) {
					this.showPaintSectionResetMenu(paintSection);
					bindPressed = Bindable.MenuContextMenu;
				}
			}
		}

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

	@Bound
	private onSwitchTo() {
		this.parent.classes.add("debug-tools-paint-panel");
		this.paintRow.appendTo(this.parent.parent);

		hookManager.register(this, "DebugToolsDialog:PaintPanel")
			.until(DebugToolsPanelEvent.SwitchAway);
	}

	@Bound
	private onSwitchAway() {
		this.painting = false;
		this.paintRow.store();
		this.parent.classes.remove("debug-tools-paint-panel");
	}

	@Bound
	private showPaintSectionResetMenu(paintSection: IPaintSection) {
		new ContextMenu(this.api, ["Lock Inspection", {
			translation: translation(DebugToolsTranslation.ResetPaintSection),
			onActivate: () => paintSection.reset(),
		}])
			.addAllDescribedOptions()
			.setPosition(...bindingManager.getMouse().xy)
			.schedule(this.api.getScreen(ScreenId.Game)!.setContextMenu);
	}

	@Bound
	private completePaint() {
		const paintData: IPaintData = {};
		for (const paintSection of this.paintSections) {
			Object.assign(paintData, paintSection.getTilePaintData());
		}

		Actions.get("paint").execute({ object: [this.paintTiles, paintData] });

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

function getId(relevantFor: SubTilePosition, ...positions: (NeighborPosition | undefined)[]) {
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
