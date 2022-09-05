import { Events, IEventEmitter, Priority } from "event/EventEmitter";
import { EventHandler, OwnEventHandler } from "event/EventManager";
import { DoodadType } from "game/doodad/IDoodad";
import { CreatureType } from "game/entity/creature/ICreature";
import { NPCType } from "game/entity/npc/INPCs";
import { TerrainType } from "game/tile/ITerrain";
import { TileEventType } from "game/tile/ITileEvent";
import Mod from "mod/Mod";
import { Registry } from "mod/ModRegistry";
import { RenderSource } from "renderer/IRenderer";
import { SpriteBatchLayer } from "renderer/world/IWorldRenderer";
import WorldRenderer from "renderer/world/WorldRenderer";
import { BlockRow } from "ui/component/BlockRow";
import Button from "ui/component/Button";
import { CheckButton } from "ui/component/CheckButton";
import Component from "ui/component/Component";
import ContextMenu from "ui/component/ContextMenu";
import { RangeRow } from "ui/component/RangeRow";
import Bind, { IBindHandlerApi } from "ui/input/Bind";
import Bindable from "ui/input/Bindable";
import InputManager from "ui/input/InputManager";
import MovementHandler from "ui/screen/screens/game/util/movement/MovementHandler";
import { Bound } from "utilities/Decorators";
import TileHelpers from "utilities/game/TileHelpers";
import { IVector2 } from "utilities/math/IVector";
import Vector2 from "utilities/math/Vector2";
import Vector3 from "utilities/math/Vector3";
import Paint from "../../action/Paint";
import DebugTools from "../../DebugTools";
import { DebugToolsTranslation, DEBUG_TOOLS_ID, translation } from "../../IDebugTools";
import Overlays from "../../overlay/Overlays";
import SelectionOverlay from "../../overlay/SelectionOverlay";
import { getTileId, getTilePosition } from "../../util/TilePosition";
import DebugToolsPanel from "../component/DebugToolsPanel";
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

interface IPaintSectionEvents extends Events<Component> {
	change(): any;
}

export interface IPaintSection extends Component {
	event: IEventEmitter<this, IPaintSectionEvents>;
	isChanging(): boolean;
	reset(): void;
	getTilePaintData(): Partial<IPaintData> | undefined;
}

const paintSections: (new () => IPaintSection)[] = [
	TerrainPaint,
	CreaturePaint,
	NPCPaint,
	DoodadPaint,
	CorpsePaint,
	TileEventPaint,
];

export default class PaintPanel extends DebugToolsPanel {

	@Mod.instance<DebugTools>(DEBUG_TOOLS_ID)
	public readonly DEBUG_TOOLS: DebugTools;

	private readonly paintSections: IPaintSection[] = [];
	private readonly paintButton: CheckButton;
	private readonly paintRow: Component;
	private readonly paintRadius: RangeRow;

	private painting = false;
	private readonly paintTiles = new Set<number>();
	private lastPaintPosition?: IVector2;
	private maxSprites = 1024;

	public constructor() {
		super();

		this.paintSections.push(...paintSections
			.map(cls => new cls()
				.event.subscribe("change", this.onPaintSectionChange)
				.appendTo(this)));

		this.paintRow = new Component()
			.classes.add("debug-tools-paint-row")
			.append(this.paintRadius = new RangeRow()
				.setLabel(label => label.setText(translation(DebugToolsTranslation.PaintRadius)))
				.editRange(range => range
					.setMin(0)
					.setMax(5)
					.setRefreshMethod(() => 0)
					.setTooltip(tooltip => tooltip.addText(text => text
						.setText(translation(DebugToolsTranslation.PaintRadiusTooltip)))))
				.setDisplayValue(true)
				.addDefaultButton(() => 0))
			.append(new BlockRow()
				.classes.add("real-paint-row")
				.append(this.paintButton = new CheckButton()
					.setText(translation(DebugToolsTranslation.ButtonPaint))
					.event.subscribe("toggle", (_, paint) => {
						this.paintRow.classes.toggle(this.painting = paint, "painting");
						if (!paint) this.clearPaint();
					}))
				.append(new Button()
					.setText(translation(DebugToolsTranslation.ButtonPaintClear))
					.setTooltip(tooltip => tooltip.addText(text => text.setText(translation(DebugToolsTranslation.TooltipPaintClear))))
					.event.subscribe("activate", this.clearPaint))
				.append(new Button()
					.setText(translation(DebugToolsTranslation.ButtonPaintComplete))
					.setTooltip(tooltip => tooltip.addText(text => text.setText(translation(DebugToolsTranslation.TooltipPaintComplete))))
					.event.subscribe("activate", this.completePaint)));
	}

	public override getTranslation() {
		return DebugToolsTranslation.PanelPaint;
	}

	////////////////////////////////////
	// Event Handlers
	//

	@EventHandler(MovementHandler, "canMove")
	protected canClientMove(): false | undefined {
		if (this.painting) return false;

		return undefined;
	}

	@EventHandler(WorldRenderer, "getMaxSpritesForLayer")
	protected getMaxSpritesForLayer(_: any, maxSprites: number) {
		return this.maxSprites = maxSprites + (this.painting ? this.paintTiles.size * 4 : 0);
	}

	@Bind.onDown(Bindable.MenuContextMenu, Priority.High)
	protected onContextMenuBind(api: IBindHandlerApi) {
		for (const paintSection of this.paintSections) {
			if (paintSection.isChanging() && api.mouse.isWithin(paintSection)) {
				this.showPaintSectionResetMenu(paintSection);
				return true;
			}
		}

		return false;
	}

	@Bind.onDown(Registry<DebugTools>(DEBUG_TOOLS_ID).get("bindablePaint"), Priority.High)
	@Bind.onDown(Registry<DebugTools>(DEBUG_TOOLS_ID).get("bindableErasePaint"), Priority.High)
	protected onStartPaintOrErasePaint(api: IBindHandlerApi) {
		return this.painting && !!gameScreen?.mouseStartWasWithin(api);
	}

	@Bind.onHolding(Registry<DebugTools>(DEBUG_TOOLS_ID).get("bindablePaint"), Priority.High)
	protected onPaint(api: IBindHandlerApi) {
		if (!this.painting || !gameScreen?.mouseStartWasWithin(api) || !renderer) {
			return false;
		}

		const tilePosition = renderer.worldRenderer.screenToTile(...api.mouse.position.xy);
		if (!tilePosition || this.lastPaintPosition === tilePosition) {
			return false;
		}

		this.lastPaintPosition = tilePosition;

		let shouldUpdateView = false;

		const direction = Vector2.direction(tilePosition, this.lastPaintPosition = this.lastPaintPosition || tilePosition);

		let interpolatedPosition = new Vector2(this.lastPaintPosition);
		for (let i = 0; i < 300; i++) { // this is only used for if it goes into an infinite loop
			interpolatedPosition = interpolatedPosition.add(direction).clamp(this.lastPaintPosition, tilePosition);

			const paintPosition = interpolatedPosition.floor(new Vector2());

			for (const [paintTilePosition] of TileHelpers.tilesInRange(localIsland, new Vector3(paintPosition, localPlayer.z), this.paintRadius.value, true)) {
				if (SelectionOverlay.add(paintTilePosition)) {
					shouldUpdateView = true;
					this.paintTiles.add(getTileId(paintTilePosition.x, paintTilePosition.y, localPlayer.z));
				}
			}

			if (paintPosition.equals(tilePosition)) {
				break;
			}
		}

		if (shouldUpdateView) {
			this.updateOverlayBatch();
			game.updateView(RenderSource.Mod, false);
		}

		return true;
	}

	@Bind.onHolding(Registry<DebugTools>(DEBUG_TOOLS_ID).get("bindableErasePaint"))
	protected onErasePaint(api: IBindHandlerApi) {
		if (!this.painting || !gameScreen?.mouseStartWasWithin(api) || !renderer) {
			return false;
		}

		const tilePosition = renderer.worldRenderer.screenToTile(...api.mouse.position.xy);
		if (!tilePosition || this.lastPaintPosition === tilePosition) {
			return false;
		}

		this.lastPaintPosition = tilePosition;

		let shouldUpdateView = false;

		const direction = Vector2.direction(tilePosition, this.lastPaintPosition = this.lastPaintPosition || tilePosition);

		let interpolatedPosition = new Vector2(this.lastPaintPosition);
		for (let i = 0; i < 300; i++) { // this is only used for if it goes into an infinite loop
			interpolatedPosition = interpolatedPosition.add(direction).clamp(this.lastPaintPosition, tilePosition);

			const paintPosition = interpolatedPosition.floor(new Vector2());

			for (const [paintTilePosition] of TileHelpers.tilesInRange(localIsland, new Vector3(paintPosition, localPlayer.z), this.paintRadius.value, true)) {
				if (SelectionOverlay.remove(paintTilePosition)) {
					shouldUpdateView = true;
					this.paintTiles.delete(getTileId(paintTilePosition.x, paintTilePosition.y, localPlayer.z));
				}
			}

			if (paintPosition.equals(tilePosition)) {
				break;
			}
		}

		if (shouldUpdateView) {
			this.updateOverlayBatch();
			game.updateView(RenderSource.Mod, false);
		}

		return true;
	}

	@Bind.onUp(Registry<DebugTools>(DEBUG_TOOLS_ID).get("bindablePaint"))
	@Bind.onUp(Registry<DebugTools>(DEBUG_TOOLS_ID).get("bindableErasePaint"))
	protected onStopPaint(api: IBindHandlerApi) {
		if (this.painting && !api.input.isHolding(this.DEBUG_TOOLS.bindablePaint) && !api.input.isHolding(this.DEBUG_TOOLS.bindableErasePaint))
			delete this.lastPaintPosition;

		return false;
	}

	@Bind.onDown(Registry<DebugTools>(DEBUG_TOOLS_ID).get("bindableCancelPaint"), Priority.High)
	protected onCancelPaint() {
		if (!this.painting)
			return false;
		this.painting = false;
		this.paintButton.setChecked(false);
		return true;
	}

	@Bind.onDown(Registry<DebugTools>(DEBUG_TOOLS_ID).get("bindableClearPaint"), Priority.High)
	protected onClearPaint() {
		if (!this.painting)
			return false;

		this.clearPaint();
		return true;
	}

	@Bind.onDown(Registry<DebugTools>(DEBUG_TOOLS_ID).get("bindableCompletePaint"), Priority.High)
	protected onCompletePaint() {
		if (!this.painting)
			return false;

		this.completePaint();
		return true;
	}

	@OwnEventHandler(PaintPanel, "switchTo")
	protected onSwitchTo() {
		this.getParent()!.classes.add("debug-tools-paint-panel");
		this.paintRow.appendTo(this.getParent()!.getParent()!);

		Bind.registerHandlers(this);
	}

	@OwnEventHandler(PaintPanel, "switchAway")
	protected onSwitchAway() {
		Bind.deregisterHandlers(this);

		this.clearPaint();
		this.painting = false;
		this.paintButton.setChecked(false);

		// store in the dialog body, which won't be removed when switching panels
		this.paintRow.store(this.getParent()!.getParent()!.getParent()!.getParent()!);
		this.getParent()?.classes.remove("debug-tools-paint-panel");

		this.paintSections.length = 0;
	}

	@OwnEventHandler(PaintPanel, "willRemove")
	protected onWillRemove() {
		this.paintSections.length = 0;
	}

	////////////////////////////////////
	// Internals
	//

	private updateOverlayBatch() {
		if (this.paintTiles.size * 4 - 512 < this.maxSprites || this.paintTiles.size * 4 + 512 > this.maxSprites) {
			renderer!.worldRenderer.initializeSpriteBatch(SpriteBatchLayer.Overlay);
		}
	}

	@Bound
	private onPaintSectionChange(paintSection: IPaintSection) {
		if (paintSection.isChanging() && !this.painting) {
			this.paintButton.setChecked(true);
		}
	}

	@Bound
	private showPaintSectionResetMenu(paintSection: IPaintSection) {
		new ContextMenu(["Lock Inspection", {
			translation: translation(DebugToolsTranslation.ResetPaintSection),
			onActivate: () => paintSection.reset(),
		}])
			.addAllDescribedOptions()
			.setPosition(...InputManager.mouse.position.xy)
			.schedule(gameScreen!.setContextMenu);
	}

	@Bound
	private completePaint() {
		const paintData: IPaintData = {};
		for (const paintSection of this.paintSections) {
			Object.assign(paintData, paintSection.getTilePaintData());
		}

		Paint.execute(localPlayer, Array.from(this.paintTiles), paintData);

		this.clearPaint();
	}

	@Bound
	private clearPaint() {
		for (const tileId of this.paintTiles) {
			const position = getTilePosition(tileId);
			const tile = localIsland.getTile(...position);
			TileHelpers.Overlay.remove(tile, Overlays.isPaint);
		}

		this.paintTiles.clear();

		this.updateOverlayBatch();
		game.updateView(RenderSource.Mod, false);
	}
}
