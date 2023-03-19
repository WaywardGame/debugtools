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
            this.selectTileHeld = false;
        }
        get selecting() { return this.selectionPromise !== undefined; }
        select() {
            this.cancel();
            this.selectionPromise = new CancelablePromise_1.default()
                .onCancel(this.cancel);
            setTimeout(this.selectionTick, game.interval);
            return this.selectionPromise;
        }
        canClientMove() {
            if (this.selecting || this.selectTileHeld) {
                return false;
            }
            return undefined;
        }
        onSelectOrCancelSelectLocation() {
            return this.selecting;
        }
        onStopSelectLocation() {
            this.selectTileHeld = false;
            return false;
        }
        selectionTick() {
            if (!this.selectionPromise) {
                return;
            }
            setTimeout(this.selectionTick, game.interval);
            const selectTilePressed = InputManager_1.default.input.isHolding(this.bindableSelectLocation) && gameScreen?.isMouseWithin();
            const cancelSelectTilePressed = InputManager_1.default.input.isHolding(this.bindableCancelSelectLocation) && gameScreen?.isMouseWithin();
            let updateRender = false;
            const tile = renderer?.worldRenderer.screenToTile(...InputManager_1.default.mouse.position.xy);
            if (tile) {
                if (tile !== this.hoverTile) {
                    updateRender = true;
                    this.hoverTile?.removeOverlay(Overlays_1.default.isHoverTarget);
                    this.hoverTile = tile;
                    tile.addOverlay({ type: this.DEBUG_TOOLS.overlayTarget }, Overlays_1.default.isHoverTarget);
                }
                if (cancelSelectTilePressed) {
                    updateRender = true;
                    this.cancel();
                }
                else if (selectTilePressed) {
                    updateRender = true;
                    this.selectTile(tile);
                    this.selectTileHeld = true;
                }
            }
            if (updateRender) {
                localPlayer.updateView(IRenderer_1.RenderSource.Mod, false);
            }
        }
        cancel() {
            const selectionPromise = this.selectionPromise;
            if (!selectionPromise) {
                return;
            }
            delete this.selectionPromise;
            if (this.hoverTile) {
                this.hoverTile.removeOverlay(Overlays_1.default.isHoverTarget);
                delete this.hoverTile;
            }
            selectionPromise.cancel();
        }
        selectTile(tile) {
            this.selectionPromise?.resolve(tile);
            this.cancel();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTG9jYXRpb25TZWxlY3Rvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9Mb2NhdGlvblNlbGVjdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztJQWlCQSxNQUFxQixjQUFjO1FBQW5DO1lBcUJTLG1CQUFjLEdBQUcsS0FBSyxDQUFDO1FBNEhoQyxDQUFDO1FBL0hBLElBQVcsU0FBUyxLQUFLLE9BQU8sSUFBSSxDQUFDLGdCQUFnQixLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUM7UUFjL0QsTUFBTTtZQUNaLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUVkLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLDJCQUFpQixFQUFRO2lCQUNuRCxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBRXhCLFVBQVUsQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUU5QyxPQUFPLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQTtRQUM3QixDQUFDO1FBVVMsYUFBYTtZQUN0QixJQUFJLElBQUksQ0FBQyxTQUFTLElBQUksSUFBSSxDQUFDLGNBQWMsRUFBRTtnQkFDMUMsT0FBTyxLQUFLLENBQUM7YUFDYjtZQUVELE9BQU8sU0FBUyxDQUFDO1FBQ2xCLENBQUM7UUFJUyw4QkFBOEI7WUFDdkMsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDO1FBQ3ZCLENBQUM7UUFHUyxvQkFBb0I7WUFDN0IsSUFBSSxDQUFDLGNBQWMsR0FBRyxLQUFLLENBQUM7WUFDNUIsT0FBTyxLQUFLLENBQUM7UUFDZCxDQUFDO1FBTWMsYUFBYTtZQUMzQixJQUFJLENBQUMsSUFBSSxDQUFDLGdCQUFnQixFQUFFO2dCQUMzQixPQUFPO2FBQ1A7WUFFRCxVQUFVLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7WUFFOUMsTUFBTSxpQkFBaUIsR0FBRyxzQkFBWSxD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