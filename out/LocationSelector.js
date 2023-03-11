var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "event/EventEmitter", "event/EventManager", "mod/Mod", "mod/ModRegistry", "renderer/IRenderer", "ui/input/Bind", "ui/input/IInput", "ui/input/InputManager", "ui/screen/screens/game/util/movement/MovementHandler", "utilities/Decorators", "./IDebugTools", "./overlay/Overlays", "./util/CancelablePromise"], function (require, exports, EventEmitter_1, EventManager_1, Mod_1, ModRegistry_1, IRenderer_1, Bind_1, IInput_1, InputManager_1, MovementHandler_1, Decorators_1, IDebugTools_1, Overlays_1, CancelablePromise_1) {
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
                const tile = renderer?.worldRenderer.screenToTile(...InputManager_1.default.mouse.position.xy);
                if (tile) {
                    if (tile !== this.hoverTile) {
                        updateRender = true;
                        if (this.hoverTile) {
                            this.hoverTile.removeOverlay(Overlays_1.default.isHoverTarget);
                        }
                        this.hoverTile = tile;
                        tile.addOverlay({ type: this.DEBUG_TOOLS.overlayTarget }, Overlays_1.default.isHoverTarget);
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
                        this.selectTile(tile);
                        this.selectTileHeld = true;
                    }
                }
            }
            else if (this.hoverTile) {
                this.hoverTile.removeOverlay(Overlays_1.default.isHoverTarget);
                delete this.hoverTile;
                updateRender = true;
            }
            if (updateRender) {
                localPlayer.updateView(IRenderer_1.RenderSource.Mod, false);
            }
        }
        cancel() {
            this._selecting = false;
            if (this.hoverTile) {
                this.hoverTile.removeOverlay(Overlays_1.default.isHoverTarget);
                delete this.hoverTile;
            }
        }
        selectTile(tile) {
            if (this.hoverTile) {
                this.hoverTile.removeOverlay(Overlays_1.default.isHoverTarget);
                delete this.hoverTile;
            }
            this._selecting = false;
            this.selectionPromise.resolve(tile);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTG9jYXRpb25TZWxlY3Rvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9Mb2NhdGlvblNlbGVjdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztJQWlCQSxNQUFxQixjQUFjO1FBQW5DO1lBa0JTLGVBQVUsR0FBRyxLQUFLLENBQUM7WUFHbkIsbUJBQWMsR0FBRyxLQUFLLENBQUM7UUFpSWhDLENBQUM7UUFuSUEsSUFBVyxTQUFTLEtBQUssT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztRQWEzQyxNQUFNO1lBQ1osSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7WUFDdkIsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO1lBQ3JCLE9BQU8sSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksMkJBQWlCLEVBQVE7aUJBQzFELFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDekIsQ0FBQztRQVVTLGFBQWE7WUFDdEIsSUFBSSxJQUFJLENBQUMsVUFBVSxJQUFJLElBQUksQ0FBQyxjQUFjLEVBQUU7Z0JBQzNDLE9BQU8sS0FBSyxDQUFDO2FBQ2I7WUFFRCxPQUFPLFNBQVMsQ0FBQztRQUNsQixDQUFDO1FBSVMsOEJBQThCO1lBQ3ZDLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQztRQUN4QixDQUFDO1FBR1Msb0JBQW9CO1lBQzdCLElBQUksQ0FBQyxjQUFjLEdBQUcsS0FBSyxDQUFDO1lBQzVCLE9BQU8sS0FBSyxDQUFDO1FBQ2QsQ0FBQztRQU1jLGFBQWE7WUFDM0IsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVO2dCQUNuQixPQUFPO1lBRVIsVUFBVSxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBRTlDLE1BQU0saUJBQWlCLEdBQUcsc0JBQVksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxJQUFJ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