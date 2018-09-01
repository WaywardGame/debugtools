import { Bindable } from "Enums";
import { HookMethod, IHookHost } from "mod/IHookHost";
import { HookPriority } from "mod/IHookManager";
import Mod from "mod/Mod";
import Register from "mod/ModRegistry";
import { BindCatcherApi } from "newui/BindingManager";
import { ScreenId } from "newui/screen/IScreen";
import GameScreen from "newui/screen/screens/GameScreen";
import { ITile } from "tile/ITerrain";
import Vector2 from "utilities/math/Vector2";
import { Bound } from "utilities/Objects";
import TileHelpers from "utilities/TileHelpers";
import DebugTools from "./DebugTools";
import { DEBUG_TOOLS_ID } from "./IDebugTools";
import Overlays from "./overlay/Overlays";
import CancelablePromise from "./util/CancelablePromise";

export default class SelectLocation implements IHookHost {

	@Mod.instance<DebugTools>(DEBUG_TOOLS_ID)
	public readonly DEBUG_TOOLS: DebugTools;

	////////////////////////////////////
	// Registrations
	//

	@Register.bindable("SelectLocation", { mouseButton: 0 })
	public readonly bindableSelectLocation: Bindable;
	@Register.bindable("CancelSelectLocation", { mouseButton: 2 })
	public readonly bindableCancelSelectLocation: Bindable;

	////////////////////////////////////
	// Fields
	//

	private _selecting = false;
	public get selecting() { return this._selecting; }
	private hoverTile?: ITile;
	private selectTileHeld = false;
	private selectionPromise: CancelablePromise<Vector2> | undefined;

	////////////////////////////////////
	// Public API
	//

	/**
	 * Returns a `CancelablePromise` that may return a `Vector2`. The promise can be canceled on the executor's end, or canceled on
	 * this end (such as if the "cancel selection" bind is pressed).
	 */
	public select() {
		this._selecting = true;
		return this.selectionPromise = new CancelablePromise<Vector2>()
			.onCancel(this.cancel);
	}

	////////////////////////////////////
	// Hooks
	//

	// tslint:disable cyclomatic-complexity
	@HookMethod(HookPriority.High)
	public onBindLoop(bindPressed: Bindable, api: BindCatcherApi) {
		const selectTilePressed = api.wasPressed(this.bindableSelectLocation) && newui.getScreen<GameScreen>(ScreenId.Game)!.isMouseWithin();
		const cancelSelectTilePressed = api.wasPressed(this.bindableCancelSelectLocation) && newui.getScreen<GameScreen>(ScreenId.Game)!.isMouseWithin();

		// if we previously had the target overlay on a tile, remove it 
		if (this.hoverTile) {
			TileHelpers.Overlay.remove(this.hoverTile, Overlays.isHoverTarget);

			delete this.hoverTile;
		}

		if (this._selecting) {
			const tilePosition = renderer.screenToTile(api.mouseX, api.mouseY);

			// add the target overlay to the tile currently being hovered
			const tile = this.hoverTile = game.getTile(tilePosition.x, tilePosition.y, localPlayer.z);
			TileHelpers.Overlay.add(tile, { type: this.DEBUG_TOOLS.overlayTarget }, Overlays.isHoverTarget);

			if (cancelSelectTilePressed && !bindPressed) {
				if (this.selectionPromise) this.selectionPromise.cancel();
				else this.cancel();
				bindPressed = this.bindableCancelSelectLocation;

			} else if (selectTilePressed && !bindPressed) {
				this.selectTile(tilePosition);

				bindPressed = this.bindableSelectLocation;
				this.selectTileHeld = true;
			}

			game.updateView(false);
		}

		if (api.wasReleased(this.bindableSelectLocation) && this.selectTileHeld) {
			this.selectTileHeld = false;
		}

		return bindPressed;
	}

	/**
	 * Prevents movement if a tile is currently being selected or if the select tile bind is still held.
	 */
	@HookMethod
	public canClientMove(api: BindCatcherApi): false | undefined {
		if (this._selecting || this.selectTileHeld) {
			return false;
		}

		return undefined;
	}

	////////////////////////////////////
	// Helpers
	//

	/**
	 * Cleanup after the location selection is canceled.
	 */
	@Bound
	private cancel() {
		this._selecting = false;
		if (this.hoverTile) {
			TileHelpers.Overlay.remove(this.hoverTile, Overlays.isHoverTarget);
			delete this.hoverTile;
		}
	}

	/**
	 * Removes the hover overlay, then resolves the selection promise with the selected position.
	 */
	private selectTile(tilePosition: Vector2) {
		if (this.hoverTile) {
			TileHelpers.Overlay.remove(this.hoverTile, Overlays.isHoverTarget);
			delete this.hoverTile;
		}

		this._selecting = false;
		this.selectionPromise!.resolve(tilePosition);
		delete this.selectionPromise;
	}

}
