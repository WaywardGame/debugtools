import { DoodadType } from "doodad/IDoodad";
import ActionExecutor from "entity/action/ActionExecutor";
import { CreatureType } from "entity/creature/ICreature";
import { NPCType } from "entity/npc/NPCS";
import { Events } from "event/EventBuses";
import { IEventEmitter } from "event/EventEmitter";
import { EventHandler } from "event/EventManager";
import { RenderSource } from "game/IGame";
import { HookMethod } from "mod/IHookHost";
import { HookPriority } from "mod/IHookManager";
import Mod from "mod/Mod";
import { bindingManager } from "newui/BindingManager";
import { BlockRow } from "newui/component/BlockRow";
import Button from "newui/component/Button";
import { CheckButton } from "newui/component/CheckButton";
import Component from "newui/component/Component";
import ContextMenu from "newui/component/ContextMenu";
import { RangeRow } from "newui/component/RangeRow";
import { Bindable, BindCatcherApi } from "newui/IBindingManager";
import MovementHandler from "newui/screen/screens/game/util/movement/MovementHandler";
import { gameScreen } from "newui/screen/screens/GameScreen";
import Spacer from "newui/screen/screens/menu/component/Spacer";
import { SpriteBatchLayer } from "renderer/IWorldRenderer";
import WorldRenderer from "renderer/WorldRenderer";
import { TerrainType } from "tile/ITerrain";
import { TileEventType } from "tile/ITileEvent";
import Vector2 from "utilities/math/Vector2";
import Vector3 from "utilities/math/Vector3";
import TileHelpers from "utilities/TileHelpers";
import Paint from "../../action/Paint";
import DebugTools from "../../DebugTools";
import { DEBUG_TOOLS_ID, DebugToolsTranslation, translation } from "../../IDebugTools";
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
	private readonly paintTiles: number[] = [];
	private lastPaintPosition?: Vector2;
	private maxSprites = 1024;

	public constructor() {
		super();

		this.paintSections.splice(0, Infinity);

		this.paintSections.push(...paintSections
			.map(cls => new cls()
				.event.subscribe("change", this.onPaintSectionChange)
				.appendTo(this)));

		new Spacer().appendTo(this);

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

	@Override public getTranslation() {
		return DebugToolsTranslation.PanelPaint;
	}

	@EventHandler(MovementHandler)("canMove")
	public canClientMove(): false | undefined {
		if (this.painting) return false;

		return undefined;
	}

	@EventHandler(WorldRenderer)("getMaxSpritesForLayer")
	public getMaxSpritesForLayer(_: any, layer: SpriteBatchLayer, maxSprites: number): number | undefined {
		if (this.painting) {
			return this.maxSprites = maxSprites + this.paintTiles.length * 4;
		}

		this.maxSprites = maxSprites;

		return undefined;
	}

	// tslint:disable cyclomatic-complexity
	@Override @HookMethod(HookPriority.High)
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
			if (api.isDown(this.DEBUG_TOOLS.bindablePaint) && gameScreen!.wasMouseStartWithin()) {
				const tilePosition = renderer.screenToTile(api.mouseX, api.mouseY);

				const direction = Vector2.direction(tilePosition, this.lastPaintPosition = this.lastPaintPosition || tilePosition);

				let interpolatedPosition = new Vector2(this.lastPaintPosition);
				for (let i = 0; i < 300; i++) { // this is only used for if it goes into an infinite loop
					interpolatedPosition = interpolatedPosition.add(direction).clamp(this.lastPaintPosition, tilePosition);

					const paintPosition = interpolatedPosition.floor(new Vector2());

					for (const [paintTilePosition] of TileHelpers.tilesInRange(new Vector3(paintPosition, localPlayer.z), this.paintRadius.value, true)) {
						SelectionOverlay.add(paintTilePosition);

						const tileId = getTileId(paintTilePosition.x, paintTilePosition.y, localPlayer.z);

						if (!this.paintTiles.includes(tileId)) this.paintTiles.push(tileId);
					}

					if (paintPosition.equals(tilePosition)) break;
				}

				this.lastPaintPosition = tilePosition;

				this.updateOverlayBatch();
				game.updateView(RenderSource.Mod, false);

				bindPressed = this.DEBUG_TOOLS.bindablePaint;
			}

			if (api.isDown(this.DEBUG_TOOLS.bindableErasePaint) && gameScreen!.wasMouseStartWithin()) {
				const tilePosition = renderer.screenToTile(api.mouseX, api.mouseY);

				const direction = Vector2.direction(tilePosition, this.lastPaintPosition = this.lastPaintPosition || tilePosition);

				let interpolatedPosition = new Vector2(this.lastPaintPosition);
				for (let i = 0; i < 300; i++) { // this is only used for if it goes into an infinite loop
					interpolatedPosition = interpolatedPosition.add(direction).clamp(this.lastPaintPosition, tilePosition);

					const paintPosition = interpolatedPosition.floor(new Vector2());

					for (const [paintTilePosition] of TileHelpers.tilesInRange(new Vector3(paintPosition, localPlayer.z), this.paintRadius.value, true)) {
						SelectionOverlay.remove(paintTilePosition);

						const tileId = getTileId(paintTilePosition.x, paintTilePosition.y, localPlayer.z);

						const index = this.paintTiles.indexOf(tileId);
						if (index > -1) this.paintTiles.splice(index, 1);
					}

					if (paintPosition.equals(tilePosition)) break;
				}

				this.lastPaintPosition = tilePosition;

				this.updateOverlayBatch();
				game.updateView(RenderSource.Mod, false);

				bindPressed = this.DEBUG_TOOLS.bindableErasePaint;
			}

			if (!bindPressed) delete this.lastPaintPosition;

			if (api.wasPressed(this.DEBUG_TOOLS.bindableCancelPaint)) {
				this.paintButton.setChecked(false);
				bindPressed = this.DEBUG_TOOLS.bindableCancelPaint;
			}

			if (api.wasPressed(this.DEBUG_TOOLS.bindableClearPaint)) {
				this.clearPaint();
				bindPressed = this.DEBUG_TOOLS.bindableClearPaint;
			}

			if (api.wasPressed(this.DEBUG_TOOLS.bindableCompletePaint)) {
				this.completePaint();
				bindPressed = this.DEBUG_TOOLS.bindableCompletePaint;
			}
		}

		return bindPressed;
	}
	// tslint:enable cyclomatic-complexity

	@EventHandler<PaintPanel>("self")("switchTo")
	protected onSwitchTo() {
		this.getParent()!.classes.add("debug-tools-paint-panel");
		this.paintRow.appendTo(this.getParent()!.getParent()!);

		this.registerHookHost("DebugToolsDialog:PaintPanel");
	}

	@EventHandler<PaintPanel>("self")("switchAway")
	protected onSwitchAway() {
		hookManager.deregister(this);

		this.paintButton.setChecked(false);

		this.paintRow.store();

		const parent = this.getParent();
		if (parent) {
			parent.classes.remove("debug-tools-paint-panel");
		}
	}

	private updateOverlayBatch() {
		if (this.paintTiles.length * 4 - 512 < this.maxSprites || this.paintTiles.length * 4 + 512 > this.maxSprites) {
			renderer.initializeSpriteBatch(SpriteBatchLayer.Overlay, true);
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
			.setPosition(...bindingManager.getMouse().xy)
			.schedule(gameScreen!.setContextMenu);
	}

	@Bound
	private completePaint() {
		const paintData: IPaintData = {};
		for (const paintSection of this.paintSections) {
			Object.assign(paintData, paintSection.getTilePaintData());
		}

		ActionExecutor.get(Paint).execute(localPlayer, [...this.paintTiles], paintData);

		this.clearPaint();
	}

	@Bound
	private clearPaint() {
		for (const tileId of this.paintTiles) {
			const position = getTilePosition(tileId);
			const tile = game.getTile(...position);
			TileHelpers.Overlay.remove(tile, Overlays.isPaint);
		}

		this.paintTiles.splice(0, Infinity);

		this.updateOverlayBatch();
		game.updateView(RenderSource.Mod, false);
	}
}
