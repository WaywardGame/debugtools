var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "event/EventEmitter", "event/EventManager", "game/IGame", "mod/Mod", "mod/ModRegistry", "newui/input/Bind", "newui/input/IInput", "newui/input/InputManager", "newui/screen/screens/game/util/movement/MovementHandler", "newui/screen/screens/GameScreen", "utilities/TileHelpers", "./IDebugTools", "./overlay/Overlays", "./util/CancelablePromise"], function (require, exports, EventEmitter_1, EventManager_1, IGame_1, Mod_1, ModRegistry_1, Bind_1, IInput_1, InputManager_1, MovementHandler_1, GameScreen_1, TileHelpers_1, IDebugTools_1, Overlays_1, CancelablePromise_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class SelectLocation {
        constructor() {
            this._selecting = false;
            this.selectTileHeld = false;
        }
        get selecting() { return this._selecting; }
        select() {
            this._selecting = true;
            this.selectionTick();
            return this.selectionPromise = new CancelablePromise_1.default()
                .onCancel(this.cancel);
        }
        canClientMove() {
            if (this._selecting || this.selectTileHeld) {
                return false;
            }
            return undefined;
        }
        onSelectOrCancelSelectLocation() {
            return this._selecting;
        }
        onStopSelectLocation() {
            this.selectTileHeld = false;
            return false;
        }
        selectionTick() {
            if (!this._selecting)
                return;
            setTimeout(this.selectionTick, game.interval);
            const selectTilePressed = InputManager_1.default.input.isHolding(this.bindableSelectLocation) && (GameScreen_1.gameScreen === null || GameScreen_1.gameScreen === void 0 ? void 0 : GameScreen_1.gameScreen.isMouseWithin());
            const cancelSelectTilePressed = InputManager_1.default.input.isHolding(this.bindableCancelSelectLocation) && (GameScreen_1.gameScreen === null || GameScreen_1.gameScreen === void 0 ? void 0 : GameScreen_1.gameScreen.isMouseWithin());
            let updateRender = false;
            if (this._selecting) {
                const tilePosition = renderer === null || renderer === void 0 ? void 0 : renderer.screenToTile(...InputManager_1.default.mouse.position.xy);
                if (tilePosition) {
                    const tile = game.getTile(tilePosition.x, tilePosition.y, localPlayer.z);
                    if (tile !== this.hoverTile) {
                        updateRender = true;
                        if (this.hoverTile) {
                            TileHelpers_1.default.Overlay.remove(this.hoverTile, Overlays_1.default.isHoverTarget);
                        }
                        this.hoverTile = tile;
                        TileHelpers_1.default.Overlay.add(tile, { type: this.DEBUG_TOOLS.overlayTarget }, Overlays_1.default.isHoverTarget);
                    }
                    if (cancelSelectTilePressed) {
                        updateRender = true;
                        if (this.selectionPromise)
                            this.selectionPromise.cancel();
                        else
                            this.cancel();
                    }
                    else if (selectTilePressed) {
                        updateRender = true;
                        this.selectTile(tilePosition);
                        this.selectTileHeld = true;
                    }
                }
            }
            else if (this.hoverTile) {
                TileHelpers_1.default.Overlay.remove(this.hoverTile, Overlays_1.default.isHoverTarget);
                delete this.hoverTile;
                updateRender = true;
            }
            if (updateRender)
                game.updateView(IGame_1.RenderSource.Mod, false);
        }
        cancel() {
            this._selecting = false;
            if (this.hoverTile) {
                TileHelpers_1.default.Overlay.remove(this.hoverTile, Overlays_1.default.isHoverTarget);
                delete this.hoverTile;
            }
        }
        selectTile(tilePosition) {
            if (this.hoverTile) {
                TileHelpers_1.default.Overlay.remove(this.hoverTile, Overlays_1.default.isHoverTarget);
                delete this.hoverTile;
            }
            this._selecting = false;
            this.selectionPromise.resolve(tilePosition);
            delete this.selectionPromise;
        }
    }
    __decorate([
        Mod_1.default.instance(IDebugTools_1.DEBUG_TOOLS_ID)
    ], SelectLocation.prototype, "DEBUG_TOOLS", void 0);
    __decorate([
        ModRegistry_1.default.bindable("SelectLocation", IInput_1.IInput.mouseButton(0))
    ], SelectLocation.prototype, "bindableSelectLocation", void 0);
    __decorate([
        ModRegistry_1.default.bindable("CancelSelectLocation", IInput_1.IInput.mouseButton(2))
    ], SelectLocation.prototype, "bindableCancelSelectLocation", void 0);
    __decorate([
        EventManager_1.EventHandler(MovementHandler_1.default, "canMove")
    ], SelectLocation.prototype, "canClientMove", null);
    __decorate([
        Bind_1.default.onDown(ModRegistry_1.Registry().get("bindableSelectLocation"), EventEmitter_1.Priority.High),
        Bind_1.default.onDown(ModRegistry_1.Registry().get("bindableCancelSelectLocation"), EventEmitter_1.Priority.High)
    ], SelectLocation.prototype, "onSelectOrCancelSelectLocation", null);
    __decorate([
        Bind_1.default.onUp(ModRegistry_1.Registry().get("bindableSelectLocation"))
    ], SelectLocation.prototype, "onStopSelectLocation", null);
    __decorate([
        Bound
    ], SelectLocation.prototype, "selectionTick", null);
    __decorate([
        Bound
    ], SelectLocation.prototype, "cancel", null);
    exports.default = SelectLocation;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTG9jYXRpb25TZWxlY3Rvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9Mb2NhdGlvblNlbGVjdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztJQW1CQSxNQUFxQixjQUFjO1FBQW5DO1lBa0JTLGVBQVUsR0FBRyxLQUFLLENBQUM7WUFHbkIsbUJBQWMsR0FBRyxLQUFLLENBQUM7UUFvSWhDLENBQUM7UUF0SUEsSUFBVyxTQUFTLEtBQUssT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztRQWEzQyxNQUFNO1lBQ1osSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7WUFDdkIsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO1lBQ3JCLE9BQU8sSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksMkJBQWlCLEVBQVc7aUJBQzdELFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDekIsQ0FBQztRQVVTLGFBQWE7WUFDdEIsSUFBSSxJQUFJLENBQUMsVUFBVSxJQUFJLElBQUksQ0FBQyxjQUFjLEVBQUU7Z0JBQzNDLE9BQU8sS0FBSyxDQUFDO2FBQ2I7WUFFRCxPQUFPLFNBQVMsQ0FBQztRQUNsQixDQUFDO1FBSVMsOEJBQThCO1lBQ3ZDLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQztRQUN4QixDQUFDO1FBR1Msb0JBQW9CO1lBQzdCLElBQUksQ0FBQyxjQUFjLEdBQUcsS0FBSyxDQUFDO1lBQzVCLE9BQU8sS0FBSyxDQUFDO1FBQ2QsQ0FBQztRQU9jLGFBQWE7WUFDM0IsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVO2dCQUNuQixPQUFPO1lBRVIsVUFBVSxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBRTlDLE1BQU0saUJBQWlCLEdBQUcsc0JBQVksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxLQUFJ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