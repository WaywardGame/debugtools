var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "event/EventEmitter", "event/EventManager", "mod/Mod", "mod/ModRegistry", "renderer/IRenderer", "ui/input/Bind", "ui/input/IInput", "ui/input/InputManager", "ui/screen/screens/game/util/movement/MovementHandler", "utilities/Decorators", "utilities/game/TileHelpers", "./IDebugTools", "./overlay/Overlays", "./util/CancelablePromise"], function (require, exports, EventEmitter_1, EventManager_1, Mod_1, ModRegistry_1, IRenderer_1, Bind_1, IInput_1, InputManager_1, MovementHandler_1, Decorators_1, TileHelpers_1, IDebugTools_1, Overlays_1, CancelablePromise_1) {
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
            const selectTilePressed = InputManager_1.default.input.isHolding(this.bindableSelectLocation) && (gameScreen === null || gameScreen === void 0 ? void 0 : gameScreen.isMouseWithin());
            const cancelSelectTilePressed = InputManager_1.default.input.isHolding(this.bindableCancelSelectLocation) && (gameScreen === null || gameScreen === void 0 ? void 0 : gameScreen.isMouseWithin());
            let updateRender = false;
            if (this._selecting) {
                const tilePosition = renderer === null || renderer === void 0 ? void 0 : renderer.worldRenderer.screenToTile(...InputManager_1.default.mouse.position.xy);
                if (tilePosition) {
                    const tile = localIsland.getTile(tilePosition.x, tilePosition.y, localPlayer.z);
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
                game.updateView(IRenderer_1.RenderSource.Mod, false);
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
        (0, EventManager_1.EventHandler)(MovementHandler_1.default, "canMove")
    ], SelectLocation.prototype, "canClientMove", null);
    __decorate([
        Bind_1.default.onDown((0, ModRegistry_1.Registry)().get("bindableSelectLocation"), EventEmitter_1.Priority.High),
        Bind_1.default.onDown((0, ModRegistry_1.Registry)().get("bindableCancelSelectLocation"), EventEmitter_1.Priority.High)
    ], SelectLocation.prototype, "onSelectOrCancelSelectLocation", null);
    __decorate([
        Bind_1.default.onUp((0, ModRegistry_1.Registry)().get("bindableSelectLocation"))
    ], SelectLocation.prototype, "onStopSelectLocation", null);
    __decorate([
        Decorators_1.Bound
    ], SelectLocation.prototype, "selectionTick", null);
    __decorate([
        Decorators_1.Bound
    ], SelectLocation.prototype, "cancel", null);
    exports.default = SelectLocation;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTG9jYXRpb25TZWxlY3Rvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9Mb2NhdGlvblNlbGVjdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztJQW1CQSxNQUFxQixjQUFjO1FBQW5DO1lBa0JTLGVBQVUsR0FBRyxLQUFLLENBQUM7WUFHbkIsbUJBQWMsR0FBRyxLQUFLLENBQUM7UUFvSWhDLENBQUM7UUF0SUEsSUFBVyxTQUFTLEtBQUssT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztRQWEzQyxNQUFNO1lBQ1osSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7WUFDdkIsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO1lBQ3JCLE9BQU8sSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksMkJBQWlCLEVBQVc7aUJBQzdELFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDekIsQ0FBQztRQVVTLGFBQWE7WUFDdEIsSUFBSSxJQUFJLENBQUMsVUFBVSxJQUFJLElBQUksQ0FBQyxjQUFjLEVBQUU7Z0JBQzNDLE9BQU8sS0FBSyxDQUFDO2FBQ2I7WUFFRCxPQUFPLFNBQVMsQ0FBQztRQUNsQixDQUFDO1FBSVMsOEJBQThCO1lBQ3ZDLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQztRQUN4QixDQUFDO1FBR1Msb0JBQW9CO1lBQzdCLElBQUksQ0FBQyxjQUFjLEdBQUcsS0FBSyxDQUFDO1lBQzVCLE9BQU8sS0FBSyxDQUFDO1FBQ2QsQ0FBQztRQU9jLGFBQWE7WUFDM0IsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVO2dCQUNuQixPQUFPO1lBRVIsVUFBVSxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBRTlDLE1BQU0saUJBQWlCLEdBQUcsc0JBQVksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxLQUFJ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