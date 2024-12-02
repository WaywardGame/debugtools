import type { Events, IEventEmitter } from "@wayward/utilities/event/EventEmitter";
import { Priority } from "@wayward/utilities/event/EventEmitter";
import { OwnEventHandler } from "@wayward/utilities/event/EventManager";
import type { DoodadType } from "@wayward/game/game/doodad/IDoodad";
import type { CreatureType } from "@wayward/game/game/entity/creature/ICreature";
import type { NPCType } from "@wayward/game/game/entity/npc/INPCs";
import type { TerrainType } from "@wayward/game/game/tile/ITerrain";
import type { TileEventType } from "@wayward/game/game/tile/ITileEvent";
import type Tile from "@wayward/game/game/tile/Tile";
import Mod from "@wayward/game/mod/Mod";
import { Registry } from "@wayward/game/mod/ModRegistry";
import { RenderSource } from "@wayward/game/renderer/IRenderer";
import { BlockRow } from "@wayward/game/ui/component/BlockRow";
import Button from "@wayward/game/ui/component/Button";
import { CheckButton } from "@wayward/game/ui/component/CheckButton";
import Component from "@wayward/game/ui/component/Component";
import ContextMenu from "@wayward/game/ui/component/ContextMenu";
import { RangeRow } from "@wayward/game/ui/component/RangeRow";
import type { IBindHandlerApi } from "@wayward/game/ui/input/Bind";
import Bind from "@wayward/game/ui/input/Bind";
import Bindable from "@wayward/game/ui/input/Bindable";
import InputManager from "@wayward/game/ui/input/InputManager";
import MovementHandler from "@wayward/game/ui/screen/screens/game/util/movement/MovementHandler";
import { Bound } from "@wayward/utilities/Decorators";
import Vector2 from "@wayward/game/utilities/math/Vector2";
import type DebugTools from "../../DebugTools";
import { DEBUG_TOOLS_ID, DebugToolsTranslation, translation } from "../../IDebugTools";
import Paint from "../../action/Paint";
import SelectionOverlay from "../../overlay/SelectionOverlay";
import DebugToolsPanel from "../component/DebugToolsPanel";
import CorpsePaint from "../paint/Corpse";
import CreaturePaint from "../paint/Creature";
import DoodadPaint from "../paint/Doodad";
import NPCPaint from "../paint/NPC";
import TerrainPaint from "../paint/Terrain";
import TileEventPaint from "../paint/TileEvent";
import { EventHandler } from "@wayward/game/event/EventManager";

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

const paintSections: Array<new () => IPaintSection> = [
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
	private readonly paintTiles = new Set<Tile>();
	private lastPaintTile?: Tile;

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
					.setTooltip(tooltip => tooltip.setText(translation(DebugToolsTranslation.PaintRadiusTooltip))))
				.setDisplayValue(true)
				.addDefaultButton(() => 0))
			.append(new BlockRow()
				.classes.add("real-paint-row")
				.append(this.paintButton = new CheckButton()
					.setText(translation(DebugToolsTranslation.ButtonPaint))
					.event.subscribe("toggle", (_, paint) => {
						this.paintRow.classes.toggle(this.painting = paint, "painting");
						if (!paint) {
							this.clearPaint();
						}
					}))
				.append(new Button()
					.setText(translation(DebugToolsTranslation.ButtonPaintClear))
					.setTooltip(tooltip => tooltip.setText(translation(DebugToolsTranslation.TooltipPaintClear)))
					.event.subscribe("activate", this.clearPaint))
				.append(new Button()
					.setText(translation(DebugToolsTranslation.ButtonPaintComplete))
					.setTooltip(tooltip => tooltip.setText(translation(DebugToolsTranslation.TooltipPaintComplete)))
					.event.subscribe("activate", this.completePaint)));
	}

	public override getTranslation(): DebugToolsTranslation {
		return DebugToolsTranslation.PanelPaint;
	}

	////////////////////////////////////
	// Event Handlers
	//

	@EventHandler(MovementHandler, "canMove")
	protected canClientMove(): false | undefined {
		if (this.painting) {
			return false;
		}

		return undefined;
	}

	@Bind.onDown(Bindable.MenuContextMenu, Priority.High)
	protected onContextMenuBind(api: IBindHandlerApi): boolean {
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
	protected onStartPaintOrErasePaint(api: IBindHandlerApi): boolean {
		return this.painting && !!gameScreen?.mouseStartWasWithin(api);
	}

	@Bind.onHolding(Registry<DebugTools>(DEBUG_TOOLS_ID).get("bindablePaint"), Priority.High)
	protected onPaint(api: IBindHandlerApi): boolean {
		if (!this.painting || !gameScreen?.mouseStartWasWithin(api) || !renderer) {
			return false;
		}

		const tilePosition = renderer.worldRenderer.screenToTile(...api.mouse.position.xy);
		if (!tilePosition || this.lastPaintTile === tilePosition) {
			return false;
		}

		this.lastPaintTile = tilePosition;

		let shouldUpdateView = false;

		const direction = Vector2.direction(tilePosition, this.lastPaintTile = this.lastPaintTile || tilePosition);

		let interpolatedPosition = new Vector2(this.lastPaintTile);
		for (let i = 0; i < 300; i++) { // this is only used for if it goes into an infinite loop
			interpolatedPosition = interpolatedPosition.add(direction).clamp(this.lastPaintTile, tilePosition);

			const paintPosition = interpolatedPosition.floor(new Vector2());

			const tile = localIsland.getTileSafe(paintPosition.x, paintPosition.y, localPlayer.z);
			if (!tile) {
				break;
			}

			for (const paintTile of tile.tilesInRange(this.paintRadius.value, true)) {
				if (SelectionOverlay.add(paintTile)) {
					shouldUpdateView = true;
					this.paintTiles.add(paintTile);
				}
			}

			if (paintPosition.equals(tilePosition)) {
				break;
			}
		}

		if (shouldUpdateView) {
			localPlayer.updateView(RenderSource.Mod, false);
		}

		return true;
	}

	@Bind.onHolding(Registry<DebugTools>(DEBUG_TOOLS_ID).get("bindableErasePaint"))
	protected onErasePaint(api: IBindHandlerApi): boolean {
		if (!this.painting || !gameScreen?.mouseStartWasWithin(api) || !renderer) {
			return false;
		}

		const tilePosition = renderer.worldRenderer.screenToTile(...api.mouse.position.xy);
		if (!tilePosition || this.lastPaintTile === tilePosition) {
			return false;
		}

		this.lastPaintTile = tilePosition;

		let shouldUpdateView = false;

		const direction = Vector2.direction(tilePosition, this.lastPaintTile = this.lastPaintTile || tilePosition);

		let interpolatedPosition = new Vector2(this.lastPaintTile);
		for (let i = 0; i < 300; i++) { // this is only used for if it goes into an infinite loop
			interpolatedPosition = interpolatedPosition.add(direction).clamp(this.lastPaintTile, tilePosition);

			const paintPosition = interpolatedPosition.floor(new Vector2());

			const tile = localIsland.getTileSafe(paintPosition.x, paintPosition.y, localPlayer.z);
			if (!tile) {
				break;
			}

			for (const paintTile of tile.tilesInRange(this.paintRadius.value, true)) {
				if (SelectionOverlay.remove(paintTile)) {
					shouldUpdateView = true;
					this.paintTiles.delete(paintTile);
				}
			}

			if (paintPosition.equals(tilePosition)) {
				break;
			}
		}

		if (shouldUpdateView) {
			localPlayer.updateView(RenderSource.Mod, false);
		}

		return true;
	}

	@Bind.onUp(Registry<DebugTools>(DEBUG_TOOLS_ID).get("bindablePaint"))
	@Bind.onUp(Registry<DebugTools>(DEBUG_TOOLS_ID).get("bindableErasePaint"))
	protected onStopPaint(api: IBindHandlerApi): boolean {
		if (this.painting && !api.input.isHolding(this.DEBUG_TOOLS.bindablePaint) && !api.input.isHolding(this.DEBUG_TOOLS.bindableErasePaint)) {
			delete this.lastPaintTile;
		}

		return false;
	}

	@Bind.onDown(Registry<DebugTools>(DEBUG_TOOLS_ID).get("bindableCancelPaint"), Priority.High)
	protected onCancelPaint(): boolean {
		if (!this.painting) {
			return false;
		}

		this.painting = false;
		this.paintButton.setChecked(false);
		return true;
	}

	@Bind.onDown(Registry<DebugTools>(DEBUG_TOOLS_ID).get("bindableClearPaint"), Priority.High)
	protected onClearPaint(): boolean {
		if (!this.painting) {
			return false;
		}

		this.clearPaint();
		return true;
	}

	@Bind.onDown(Registry<DebugTools>(DEBUG_TOOLS_ID).get("bindableCompletePaint"), Priority.High)
	protected onCompletePaint(): boolean {
		if (!this.painting) {
			return false;
		}

		this.completePaint();
		return true;
	}

	@OwnEventHandler(PaintPanel, "switchTo")
	protected onSwitchTo(): void {
		this.getParent()!.classes.add("debug-tools-paint-panel");
		this.paintRow.appendTo(this.getParent()!.getParent()!);

		this.paintSections.length = 0;

		for (const childComponent of this.getChildren()) {
			if ((childComponent as IPaintSection).getTilePaintData) {
				this.paintSections.push(childComponent as IPaintSection);
			}
		}

		Bind.registerHandlers(this);
	}

	@OwnEventHandler(PaintPanel, "switchAway")
	protected onSwitchAway(): void {
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
	protected onWillRemove(): void {
		this.paintSections.length = 0;
	}

	////////////////////////////////////
	// Internals
	//

	@Bound
	private onPaintSectionChange(paintSection: IPaintSection): void {
		if (paintSection.isChanging() && !this.painting) {
			this.paintButton.setChecked(true);
		}
	}

	@Bound
	private showPaintSectionResetMenu(paintSection: IPaintSection): void {
		new ContextMenu(["Lock Inspection", {
			translation: translation(DebugToolsTranslation.ResetPaintSection),
			onActivate: () => paintSection.reset(),
		}])
			.addAllDescribedOptions()
			.setPosition(...InputManager.mouse.position.xy)
			.schedule(gameScreen!.setContextMenu);
	}

	@Bound
	private completePaint(): void {
		const paintData: IPaintData = {};
		for (const paintSection of this.paintSections) {
			Object.assign(paintData, paintSection.getTilePaintData());
		}

		void Paint.execute(localPlayer, Array.from(this.paintTiles.keys()), paintData);

		this.clearPaint();
	}

	@Bound
	private clearPaint(): void {
		for (const tile of this.paintTiles) {
			SelectionOverlay.remove(tile);
		}

		this.paintTiles.clear();

		localPlayer.updateView(RenderSource.Mod, false);
	}
}
