var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "mod/IHookHost", "mod/IHookManager", "mod/ModRegistry", "newui/screen/IScreen", "utilities/Objects", "utilities/TileHelpers", "./DebugTools", "./IDebugTools", "./util/CancelablePromise"], function (require, exports, IHookHost_1, IHookManager_1, ModRegistry_1, IScreen_1, Objects_1, TileHelpers_1, DebugTools_1, IDebugTools_1, CancelablePromise_1) {
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
            return this.selectionPromise = new CancelablePromise_1.default()
                .onCancel(this.cancel);
        }
        onBindLoop(bindPressed, api) {
            const selectTilePressed = api.wasPressed(this.bindableSelectLocation) && newui.getScreen(IScreen_1.ScreenId.Game).isMouseWithin();
            const cancelSelectTilePressed = api.wasPressed(this.bindableCancelSelectLocation) && newui.getScreen(IScreen_1.ScreenId.Game).isMouseWithin();
            if (this.hoverTile) {
                TileHelpers_1.default.Overlay.remove(this.hoverTile, IDebugTools_1.isHoverTargetOverlay);
                delete this.hoverTile;
            }
            if (this._selecting) {
                const tilePosition = renderer.screenToTile(api.mouseX, api.mouseY);
                const tile = this.hoverTile = game.getTile(tilePosition.x, tilePosition.y, localPlayer.z);
                TileHelpers_1.default.Overlay.add(tile, { type: DebugTools_1.default.INSTANCE.overlayTarget }, IDebugTools_1.isHoverTargetOverlay);
                if (cancelSelectTilePressed && !bindPressed) {
                    if (this.selectionPromise)
                        this.selectionPromise.cancel();
                    else
                        this.cancel();
                    bindPressed = this.bindableCancelSelectLocation;
                }
                else if (selectTilePressed && !bindPressed) {
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
        canClientMove(api) {
            if (this._selecting || this.selectTileHeld) {
                return false;
            }
            return undefined;
        }
        cancel() {
            this._selecting = false;
            if (this.hoverTile) {
                TileHelpers_1.default.Overlay.remove(this.hoverTile, IDebugTools_1.isHoverTargetOverlay);
                delete this.hoverTile;
            }
        }
        selectTile(tilePosition) {
            if (this.hoverTile) {
                TileHelpers_1.default.Overlay.remove(this.hoverTile, IDebugTools_1.isHoverTargetOverlay);
                delete this.hoverTile;
            }
            this._selecting = false;
            this.selectionPromise.resolve(tilePosition);
            delete this.selectionPromise;
        }
    }
    __decorate([
        ModRegistry_1.default.bindable("SelectLocation", { mouseButton: 0 })
    ], SelectLocation.prototype, "bindableSelectLocation", void 0);
    __decorate([
        ModRegistry_1.default.bindable("CancelSelectLocation", { mouseButton: 2 })
    ], SelectLocation.prototype, "bindableCancelSelectLocation", void 0);
    __decorate([
        IHookHost_1.HookMethod(IHookManager_1.HookPriority.High)
    ], SelectLocation.prototype, "onBindLoop", null);
    __decorate([
        IHookHost_1.HookMethod
    ], SelectLocation.prototype, "canClientMove", null);
    __decorate([
        Objects_1.Bound
    ], SelectLocation.prototype, "cancel", null);
    exports.default = SelectLocation;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTG9jYXRpb25TZWxlY3Rvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9Mb2NhdGlvblNlbGVjdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztJQWVBLE1BQXFCLGNBQWM7UUFBbkM7WUFPUyxlQUFVLEdBQUcsS0FBSyxDQUFDO1lBR25CLG1CQUFjLEdBQUcsS0FBSyxDQUFDO1FBNkVoQyxDQUFDO1FBL0VBLElBQVcsU0FBUyxLQUFLLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7UUFLM0MsTUFBTTtZQUNaLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO1lBQ3ZCLE9BQU8sSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksMkJBQWlCLEVBQVc7aUJBQzdELFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDekIsQ0FBQztRQUlNLFVBQVUsQ0FBQyxXQUFxQixFQUFFLEdBQW1CO1lBQzNELE1BQU0saUJBQWlCLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsc0JBQXNCLENBQUMsSUFBSSxLQUFLLENBQUMsU0FBUyxDQUFhLGtCQUFRLENBQUMsSUFBSSxDQUFFLENBQUMsYUFBYSxFQUFFLENBQUM7WUFDckksTUFBTSx1QkFBdUIsR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyw0QkFBNEIsQ0FBQyxJQUFJLEtBQUssQ0FBQyxTQUFTLENBQWEsa0JBQVEsQ0FBQyxJQUFJLENBQUUsQ0FBQyxhQUFhLEVBQUUsQ0FBQztZQUVqSixJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUU7Z0JBQ25CLHFCQUFXLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLGtDQUFvQixDQUFDLENBQUM7Z0JBRWpFLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQzthQUN0QjtZQUVELElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRTtnQkFDcEIsTUFB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