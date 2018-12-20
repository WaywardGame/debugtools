import ActionExecutor from "action/ActionExecutor";
import { Bindable, CreatureType, DoodadType, NPCType, SpriteBatchLayer, TerrainType } from "Enums";
import { HookMethod } from "mod/IHookHost";
import { HookPriority } from "mod/IHookManager";
import Mod from "mod/Mod";
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
import { TileEventType } from "tile/ITileEvent";
import Vector2 from "utilities/math/Vector2";
import { Bound } from "utilities/Objects";
import TileHelpers from "utilities/TileHelpers";
import Paint from "../../action/Paint";
import DebugTools from "../../DebugTools";
import { DEBUG_TOOLS_ID, DebugToolsTranslation, translation } from "../../IDebugTools";
import Overlays from "../../overlay/Overlays";
import SelectionOverlay from "../../overlay/SelectionOverlay";
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

	@Mod.instance<DebugTools>(DEBUG_TOOLS_ID)
	public readonly DEBUG_TOOLS: DebugTools;

	private readonly paintSections: IPaintSection[] = [];
	private paintButton: CheckButton;
	private paintRow: Component;

	private painting = false;
	private readonly paintTiles: number[] = [];
	private lastPaintPosition?: Vector2;
	private maxSprites = 1024;

	public constructor(gsapi: IGameScreenApi) {
		super(gsapi);

		this.paintSections.splice(0, Infinity);

		this.paintSections.push(...paintSections
			.map(cls => new cls(this.api)
				.on("change", this.onPaintSectionChange)
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

	@HookMethod
	public getMaxSpritesForLayer(layer: SpriteBatchLayer, maxSprites: number): number | undefined {
		if (this.painting) {
			return this.maxSprites = maxSprites + this.paintTiles.length * 4;
		}

		this.maxSprites = maxSprites;

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
			if (api.isDown(this.DEBUG_TOOLS.bindablePaint) && this.gsapi.wasMouseStartWithin()) {
				const tilePosition = renderer.screenToTile(api.mouseX, api.mouseY);

				const direction = Vector2.direction(tilePosition, this.lastPaintPosition = this.lastPaintPosition || tilePosition);

				let interpolatedPosition = new Vector2(this.lastPaintPosition);
				for (let i = 0; i < 300; i++) { // this is only used for if it goes into an infinite loop
					interpolatedPosition = interpolatedPosition.add(direction).clamp(this.lastPaintPosition, tilePosition);

					const paintPosition = interpolatedPosition.floor(new Vector2());

					SelectionOverlay.add(paintPosition);

					const tileId = getTileId(paintPosition.x, paintPosition.y, localPlayer.z);

					if (!this.paintTiles.includes(tileId)) this.paintTiles.push(tileId);

					if (paintPosition.equals(tilePosition)) break;
				}

				this.lastPaintPosition = tilePosition;

				this.updateOverlayBatch();
				game.updateView(false);

				bindPressed = this.DEBUG_TOOLS.bindablePaint;
			}

			if (api.isDown(this.DEBUG_TOOLS.bindableErasePaint) && this.gsapi.wasMouseStartWithin()) {
				const tilePosition = renderer.screenToTile(api.mouseX, api.mouseY);

				const direction = Vector2.direction(tilePosition, this.lastPaintPosition = this.lastPaintPosition || tilePosition);

				let interpolatedPosition = new Vector2(this.lastPaintPosition);
				for (let i = 0; i < 300; i++) { // this is only used for if it goes into an infinite loop
					interpolatedPosition = interpolatedPosition.add(direction).clamp(this.lastPaintPosition, tilePosition);

					const paintPosition = interpolatedPosition.floor(new Vector2());

					SelectionOverlay.remove(paintPosition);

					const tileId = getTileId(paintPosition.x, paintPosition.y, localPlayer.z);

					const index = this.paintTiles.indexOf(tileId);
					if (index > -1) this.paintTiles.splice(index, 1);

					if (paintPosition.equals(tilePosition)) break;
				}

				this.lastPaintPosition = tilePosition;

				this.updateOverlayBatch();
				game.updateView(false);

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

	private updateOverlayBatch() {
		if (this.paintTiles.length * 4 - 512 < this.maxSprites || this.paintTiles.length * 4 + 512 > this.maxSprites) {
			renderer.initializeSpriteBatch(SpriteBatchLayer.Overlay, true);
		}
	}

	@Bound
	private onSwitchTo() {
		this.getParent()!.classes.add("debug-tools-paint-panel");
		this.paintRow.appendTo(this.getParent()!.getParent()!);

		hookManager.register(this, "DebugToolsDialog:PaintPanel")
			.until(DebugToolsPanelEvent.SwitchAway);
	}

	@Bound
	private onSwitchAway() {
		this.paintButton.setChecked(false);

		this.paintRow.store();

		const parent = this.getParent();
		if (parent) {
			parent.classes.remove("debug-tools-paint-panel");
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
		game.updateView(false);
	}
}
