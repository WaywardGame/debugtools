/*!
 * Copyright 2011-2023 Unlok
 * https://www.unlok.ca
 *
 * Credits & Thanks:
 * https://www.unlok.ca/credits-thanks/
 *
 * Wayward is a copyrighted and licensed work. Modification and/or distribution of any source files is prohibited. If you wish to modify the game in any way, please refer to the modding guide:
 * https://github.com/WaywardGame/types/wiki
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "@wayward/utilities/event/EventEmitter", "@wayward/game/event/EventManager", "@wayward/game/mod/Mod", "@wayward/game/mod/ModRegistry", "@wayward/game/renderer/IRenderer", "@wayward/game/ui/input/Bind", "@wayward/game/ui/input/IInput", "@wayward/game/ui/input/InputManager", "@wayward/game/ui/screen/screens/game/util/movement/MovementHandler", "@wayward/utilities/Decorators", "./IDebugTools", "@wayward/utilities/promise/CancelablePromise"], function (require, exports, EventEmitter_1, EventManager_1, Mod_1, ModRegistry_1, IRenderer_1, Bind_1, IInput_1, InputManager_1, MovementHandler_1, Decorators_1, IDebugTools_1, CancelablePromise_1) {
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
                this.hoverTile.tile.removeOverlay(this.hoverTile.overlay);
                delete this.hoverTile;
            }
            selectionPromise.cancel();
        }
        selectTile(tile) {
            this.selectionPromise?.resolve(tile);
            this.cancel();
        }
    }
    exports.default = SelectLocation;
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
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTG9jYXRpb25TZWxlY3Rvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9Mb2NhdGlvblNlbGVjdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7R0FTRzs7Ozs7Ozs7OztJQW1CSCxNQUFxQixjQUFjO1FBQW5DO1lBcUJTLG1CQUFjLEdBQUcsS0FBSyxDQUFDO1FBOEhoQyxDQUFDO1FBaklBLElBQVcsU0FBUyxLQUFLLE9BQU8sSUFBSSxDQUFDLGdCQUFnQixLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUM7UUFjL0QsTUFBTTtZQUNaLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUVkLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLDJCQUFpQixFQUFRO2lCQUNuRCxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBRXhCLFVBQVUsQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUU5QyxPQUFPLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQTtRQUM3QixDQUFDO1FBVVMsYUFBYTtZQUN0QixJQUFJLElBQUksQ0FBQyxTQUFTLElBQUksSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO2dCQUMzQyxPQUFPLEtBQUssQ0FBQztZQUNkLENBQUM7WUFFRCxPQUFPLFNBQVMsQ0FBQztRQUNsQixDQUFDO1FBSVMsOEJBQThCO1lBQ3ZDLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQztRQUN2QixDQUFDO1FBR1Msb0JBQW9CO1lBQzdCLElBQUksQ0FBQyxjQUFjLEdBQUcsS0FBSyxDQUFDO1lBQzVCLE9BQU8sS0FBSyxDQUFDO1FBQ2QsQ0FBQztRQU1jLGFBQWE7WUFDM0IsSUFBSSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO2dCQUM1QixPQUFPO1lBQ1IsQ0FBQztZQUVELFVBQVUsQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxRQUFRLENB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