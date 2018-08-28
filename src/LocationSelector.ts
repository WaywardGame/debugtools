import { Bindable } from "Enums";
import { HookMethod, IHookHost } from "mod/IHookHost";
import { HookPriority } from "mod/IHookManager";
import Register from "mod/ModRegistry";
import { BindCatcherApi } from "newui/BindingManager";
import { ScreenId } from "newui/screen/IScreen";
import GameScreen from "newui/screen/screens/GameScreen";
import { ITile } from "tile/ITerrain";
import Vector2 from "utilities/math/Vector2";
import { Bound } from "utilities/Objects";
import TileHelpers from "utilities/TileHelpers";
import DebugTools from "./DebugTools";
import { isHoverTargetOverlay } from "./IDebugTools";
import CancelablePromise from "./util/CancelablePromise";

export default class SelectLocation implements IHookHost {

	@Register.bindable("SelectLocation", { mouseButton: 0 })
	public readonly bindableSelectLocation: Bindable;
	@Register.bindable("CancelSelectLocation", { mouseButton: 2 })
	public readonly bindableCancelSelectLocation: Bindable;

	private _selecting = false;
	public get selecting() { return this._selecting; }
	private hoverTile?: ITile;
	private selectTileHeld = false;
	private selectionPromise: CancelablePromise<Vector2> | undefined;

	public select() {
		this._selecting = true;
		return this.selectionPromise = new CancelablePromise<Vector2>()
			.onCancel(this.cancel);
	}

	// tslint:disable cyclomatic-complexity
	@HookMethod(HookPriority.High)
	public onBindLoop(bindPressed: Bindable, api: BindCatcherApi) {
		const selectTilePressed = api.wasPressed(this.bindableSelectLocation) && newui.getScreen<GameScreen>(ScreenId.Game)!.isMouseWithin();
		const cancelSelectTilePressed = api.wasPressed(this.bindableCancelSelectLocation) && newui.getScreen<GameScreen>(ScreenId.Game)!.isMouseWithin();

		if (this.hoverTile) {
			TileHelpers.Overlay.remove(this.hoverTile, isHoverTargetOverlay);

			delete this.hoverTile;
		}

		if (this._selecting) {
			const tilePosition = renderer.screenToTile(api.mouseX, api.mouseY);

			const tile = this.hoverTile = game.getTile(tilePosition.x, tilePosition.y, localPlayer.z);
			TileHelpers.Overlay.add(tile, { type: DebugTools.INSTANCE.overlayTarget }, isHoverTargetOverlay);

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

	@HookMethod
	public canClientMove(api: BindCatcherApi): false | undefined {
		if (this._selecting || this.selectTileHeld) {
			return false;
		}

		return undefined;
	}

	@Bound
	private cancel() {
		this._selecting = false;
		if (this.hoverTile) {
			TileHelpers.Overlay.remove(this.hoverTile, isHoverTargetOverlay);
			delete this.hoverTile;
		}
	}

	private selectTile(tilePosition: Vector2) {
		if (this.hoverTile) {
			TileHelpers.Overlay.remove(this.hoverTile, isHoverTargetOverlay);
			delete this.hoverTile;
		}

		this._selecting = false;
		this.selectionPromise!.resolve(tilePosition);
		delete this.selectionPromise;
	}

}
