import { Priority } from "@wayward/utilities/event/EventEmitter";
import { EventHandler } from "@wayward/game/event/EventManager";
import Tile from "@wayward/game/game/tile/Tile";
import Mod from "@wayward/game/mod/Mod";
import Register, { Registry } from "@wayward/game/mod/ModRegistry";
import { RenderSource } from "@wayward/game/renderer/IRenderer";
import Bind from "@wayward/game/ui/input/Bind";
import Bindable from "@wayward/game/ui/input/Bindable";
import { IInput } from "@wayward/game/ui/input/IInput";
import InputManager from "@wayward/game/ui/input/InputManager";
import MovementHandler from "@wayward/game/ui/screen/screens/game/util/movement/MovementHandler";
import { Bound } from "@wayward/utilities/Decorators";
import DebugTools from "./DebugTools";
import { DEBUG_TOOLS_ID } from "./IDebugTools";
import CancelablePromise from "@wayward/utilities/promise/CancelablePromise";
import { IOverlayInfo } from "@wayward/game/game/tile/ITerrain";

export default class SelectLocation {

	@Mod.instance<DebugTools>(DEBUG_TOOLS_ID)
	public readonly DEBUG_TOOLS: DebugTools;

	////////////////////////////////////
	// Registrations
	//

	@Register.bindable("SelectLocation", IInput.mouseButton(0))
	public readonly bindableSelectLocation: Bindable;
	@Register.bindable("CancelSelectLocation", IInput.mouseButton(2))
	public readonly bindableCancelSelectLocation: Bindable;

	////////////////////////////////////
	// Fields
	//

	public get selecting() { return this.selectionPromise !== undefined; }

	private hoverTile?: { tile: Tile; overlay: IOverlayInfo };
	private selectTileHeld = false;
	private selectionPromise: CancelablePromise<Tile> | undefined;

	////////////////////////////////////
	// Public API
	//

	/**
	 * Returns a `CancelablePromise` that may return a `Vector2`. The promise can be canceled on the executor's end, or canceled on
	 * this end (such as if the "cancel selection" bind is pressed).
	 */
	public select(): CancelablePromise<Tile> {
		this.cancel();

		this.selectionPromise = new CancelablePromise<Tile>()
			.onCancel(this.cancel);

		setTimeout(this.selectionTick, game.interval);

		return this.selectionPromise
	}

	////////////////////////////////////
	// Event Handlers
	//

	/**
	 * Prevents movement if a tile is currently being selected or if the select tile bind is still held.
	 */
	@EventHandler(MovementHandler, "canMove")
	protected canClientMove(): false | undefined {
		if (this.selecting || this.selectTileHeld) {
			return false;
		}

		return undefined;
	}

	@Bind.onDown(Registry<SelectLocation>().get("bindableSelectLocation"), Priority.High)
	@Bind.onDown(Registry<SelectLocation>().get("bindableCancelSelectLocation"), Priority.High)
	protected onSelectOrCancelSelectLocation(): boolean {
		return this.selecting;
	}

	@Bind.onUp(Registry<SelectLocation>().get("bindableSelectLocation"))
	protected onStopSelectLocation(): boolean {
		this.selectTileHeld = false;
		return false;
	}

	////////////////////////////////////
	// Helpers
	//

	@Bound private selectionTick(): void {
		if (!this.selectionPromise) {
			return;
		}

		setTimeout(this.selectionTick, game.interval);

		const selectTilePressed = InputManager.input.isHolding(this.bindableSelectLocation) && gameScreen?.isMouseWithin;
		const cancelSelectTilePressed = InputManager.input.isHolding(this.bindableCancelSelectLocation) && gameScreen?.isMouseWithin;

		let updateRender = false;

		const tile = renderer?.worldRenderer.screenToTile(...InputManager.mouse.position.xy);
		if (tile) {
			if (tile !== this.hoverTile?.tile) {
				updateRender = true;

				if (this.hoverTile?.tile) {
					this.hoverTile.tile.removeOverlay(this.hoverTile.overlay);
				}

				this.hoverTile = { tile, overlay: { type: this.DEBUG_TOOLS.overlayTarget } };
				tile.addOrUpdateOverlay(this.hoverTile.overlay);
			}

			if (cancelSelectTilePressed) {
				updateRender = true;

				this.cancel();

			} else if (selectTilePressed) {
				updateRender = true;

				this.selectTile(tile);

				this.selectTileHeld = true;
			}
		}

		if (updateRender) {
			localPlayer.updateView(RenderSource.Mod, false);
		}
	}

	/**
	 * Cleanup after the location selection is canceled.
	 */
	@Bound
	private cancel(): void {
		const selectionPromise = this.selectionPromise;
		if (!selectionPromise) {
			return;
		}

		delete this.selectionPromise;

		if (this.hoverTile) {
			this.hoverTile.tile.removeOverlay(this.hoverTile.overlay);
			delete this.hoverTile;
		}

		selectionPromise.cancel();
	}

	/**
	 * Removes the hover overlay, then resolves the selection promise with the selected position.
	 */
	private selectTile(tile: Tile): void {
		this.selectionPromise?.resolve(tile);
		this.cancel();
	}

}
