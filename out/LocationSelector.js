var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "mod/IHookHost", "mod/IHookManager", "mod/Mod", "mod/ModRegistry", "newui/screen/IScreen", "utilities/Objects", "utilities/TileHelpers", "./IDebugTools", "./overlay/Overlays", "./util/CancelablePromise"], function (require, exports, IHookHost_1, IHookManager_1, Mod_1, ModRegistry_1, IScreen_1, Objects_1, TileHelpers_1, IDebugTools_1, Overlays_1, CancelablePromise_1) {
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
                TileHelpers_1.default.Overlay.remove(this.hoverTile, Overlays_1.default.isHoverTarget);
                delete this.hoverTile;
            }
            if (this._selecting) {
                const tilePosition = renderer.screenToTile(api.mouseX, api.mouseY);
                const tile = this.hoverTile = game.getTile(tilePosition.x, tilePosition.y, localPlayer.z);
                TileHelpers_1.default.Overlay.add(tile, { type: this.DEBUG_TOOLS.overlayTarget }, Overlays_1.default.isHoverTarget);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTG9jYXRpb25TZWxlY3Rvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9Mb2NhdGlvblNlbGVjdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztJQWlCQSxNQUFxQixjQUFjO1FBQW5DO1lBa0JTLGVBQVUsR0FBRyxLQUFLLENBQUM7WUFHbkIsbUJBQWMsR0FBRyxLQUFLLENBQUM7UUF5R2hDLENBQUM7UUEzR0EsSUFBVyxTQUFTLEtBQUssT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztRQWEzQyxNQUFNO1lBQ1osSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7WUFDdkIsT0FBTyxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSwyQkFBaUIsRUFBVztpQkFDN0QsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN6QixDQUFDO1FBUU0sVUFBVSxDQUFDLFdBQXFCLEVBQUUsR0FBbUI7WUFDM0QsTUFBTSxpQkFBaUIsR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxJQUFJLEtBQUssQ0FBQyxTQUFTLENBQWEsa0JBQVEsQ0FBQyxJQUFJLENBQUUsQ0FBQyxhQUFhLEVBQUUsQ0FBQztZQUNySSxNQUFNLHVCQUF1QixHQUFHLEdBQUcsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLDRCQUE0QixDQUFDLElBQUksS0FBSyxDQUFDLFNBQVMsQ0FBYSxrQkFBUSxDQUFDLElBQUksQ0FBRSxDQUFDLGFBQWEsRUFBRSxDQUFDO1lBR2pKLElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRTtnQkFDbkIscUJBQVcsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsa0JBQVEsQ0FBQyxhQUFhLENBQUMsQ0FBQztnQkFFbkUsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDO2FBQ3RCO1lBRUQsSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFF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