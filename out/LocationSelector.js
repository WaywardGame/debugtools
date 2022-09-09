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
            const selectTilePressed = InputManager_1.default.input.isHolding(this.bindableSelectLocation) && gameScreen?.isMouseWithin();
            const cancelSelectTilePressed = InputManager_1.default.input.isHolding(this.bindableCancelSelectLocation) && gameScreen?.isMouseWithin();
            let updateRender = false;
            if (this._selecting) {
                const tilePosition = renderer?.worldRenderer.screenToTile(...InputManager_1.default.mouse.position.xy);
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
                renderers.updateView(IRenderer_1.RenderSource.Mod, false);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTG9jYXRpb25TZWxlY3Rvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9Mb2NhdGlvblNlbGVjdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztJQW1CQSxNQUFxQixjQUFjO1FBQW5DO1lBa0JTLGVBQVUsR0FBRyxLQUFLLENBQUM7WUFHbkIsbUJBQWMsR0FBRyxLQUFLLENBQUM7UUFvSWhDLENBQUM7UUF0SUEsSUFBVyxTQUFTLEtBQUssT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztRQWEzQyxNQUFNO1lBQ1osSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7WUFDdkIsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO1lBQ3JCLE9BQU8sSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksMkJBQWlCLEVBQVc7aUJBQzdELFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDekIsQ0FBQztRQVVTLGFBQWE7WUFDdEIsSUFBSSxJQUFJLENBQUMsVUFBVSxJQUFJLElBQUksQ0FBQyxjQUFjLEVBQUU7Z0JBQzNDLE9BQU8sS0FBSyxDQUFDO2FBQ2I7WUFFRCxPQUFPLFNBQVMsQ0FBQztRQUNsQixDQUFDO1FBSVMsOEJBQThCO1lBQ3ZDLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQztRQUN4QixDQUFDO1FBR1Msb0JBQW9CO1lBQzdCLElBQUksQ0FBQyxjQUFjLEdBQUcsS0FBSyxDQUFDO1lBQzVCLE9BQU8sS0FBSyxDQUFDO1FBQ2QsQ0FBQztRQU9jLGFBQWE7WUFDM0IsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVO2dCQUNuQixPQUFPO1lBRVIsVUFBVSxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBRTlDLE1BQU0saUJBQWlCLEdBQUcsc0JBQVksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxJQUFJ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