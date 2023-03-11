import { Priority } from "event/EventEmitter";
import { EventHandler } from "event/EventManager";
import Tile from "game/tile/Tile";
import Mod from "mod/Mod";
import Register, { Registry } from "mod/ModRegistry";
import { RenderSource } from "renderer/IRenderer";
import Bind from "ui/input/Bind";
import Bindable from "ui/input/Bindable";
import { IInput } from "ui/input/IInput";
import InputManager from "ui/input/InputManager";
import MovementHandler from "ui/screen/screens/game/util/movement/MovementHandler";
import { Bound } from "utilities/Decorators";
import DebugTools from "./DebugTools";
import { DEBUG_TOOLS_ID } from "./IDebugTools";
import Overlays from "./overlay/Overlays";
import CancelablePromise from "./util/CancelablePromise";

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

	private _selecting = false;
	public get selecting() { return this._selecting; }
	private hoverTile?: Tile;
	private selectTileHeld = false;
	private selectionPromise: CancelablePromise<Tile> | undefined;

	////////////////////////////////////
	// Public API
	//

	/**
	 * Returns a `CancelablePromise` that may return a `Vector2`. The promise can be canceled on the executor's end, or canceled on
	 * this end (such as if the "cancel selection" bind is pressed).
	 */
	public select() {
		this._selecting = true;
		this.selectionTick();
		return this.selectionPromise = new CancelablePromise<Tile>()
			.onCancel(this.cancel);
	}

	////////////////////////////////////
	// Event Handlers
	//

	/**
	 * Prevents movement if a tile is currently being selected or if the select tile bind is still held.
	 */
	@EventHandler(MovementHandler, "canMove")
	protected canClientMove(): false | undefined {
		if (this._selecting || this.selectTileHeld) {
			return false;
		}

		return undefined;
	}

	@Bind.onDown(Registry<SelectLocation>().get("bindableSelectLocation"), Priority.High)
	@Bind.onDown(Registry<SelectLocation>().get("bindableCancelSelectLocation"), Priority.High)
	protected onSelectOrCancelSelectLocation() {
		return this._selecting;
	}

	@Bind.onUp(Registry<SelectLocation>().get("bindableSelectLocation"))
	protected onStopSelectLocation() {
		this.selectTileHeld = false;
		return false;
	}

	////////////////////////////////////
	// Helpers
	//

	@Bound private selectionTick() {
		if (!this._selecting)
			return;

		setTimeout(this.selectionTick, game.interval);

		const selectTilePressed = InputManager.input.isHolding(this.bindableSelectLocation) && gameScreen?.isMouseWithin();
		const cancelSelectTilePressed = InputManager.input.isHolding(this.bindableCancelSelectLocation) && gameScreen?.isMouseWithin();

		let updateRender = false;

		if (this._selecting) {
			const tile = renderer?.worldRenderer.screenToTile(...InputManager.mouse.position.xy);
			if (tile) {
				if (tile !== this.hoverTile) {
					updateRender = true;

					if (this.hoverTile) {
						this.hoverTile.removeOverlay(Overlays.isHoverTarget);
					}

					this.hoverTile = tile;
					tile.addOverlay({ type: this.DEBUG_TOOLS.overlayTarget }, Overlays.isHoverTarget);
				}

				if (cancelSelectTilePressed) {
					updateRender = true;

					if (this.selectionPromise) this.selectionPromise.cancel();
					else this.cancel();

				} else if (selectTilePressed) {
					updateRender = true;

					this.selectTile(tile);

					this.selectTileHeld = true;
				}
			}

		} else if (this.hoverTile) {
			// if we previously had the target overlay on a tile, remove it
			this.hoverTile.removeOverlay(Overlays.isHoverTarget);
			delete this.hoverTile;

			updateRender = true;
		}

		if (updateRender) {
			localPlayer.updateView(RenderSource.Mod, false);
		}
	}

	/**
	 * Cleanup after the location selection is canceled.
	 */
	@Bound
	private cancel() {
		this._selecting = false;
		if (this.hoverTile) {
			this.hoverTile.removeOverlay(Overlays.isHoverTarget);
			delete this.hoverTile;
		}
	}

	/**
	 * Removes the hover overlay, then resolves the selection promise with the selected position.
	 */
	private selectTile(tile: Tile) {
		if (this.hoverTile) {
			this.hoverTile.removeOverlay(Overlays.isHoverTarget);
			delete this.hoverTile;
		}

		this._selecting = false;
		this.selectionPromise!.resolve(tile);
		delete this.selectionPromise;
	}

}
