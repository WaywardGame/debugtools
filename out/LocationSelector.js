var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "game/IGame", "mod/IHookHost", "mod/IHookManager", "mod/Mod", "mod/ModRegistry", "utilities/Objects", "utilities/TileHelpers", "./IDebugTools", "./overlay/Overlays", "./util/CancelablePromise"], function (require, exports, IGame_1, IHookHost_1, IHookManager_1, Mod_1, ModRegistry_1, Objects_1, TileHelpers_1, IDebugTools_1, Overlays_1, CancelablePromise_1) {
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
            const selectTilePressed = api.wasPressed(this.bindableSelectLocation) && gameScreen.isMouseWithin();
            const cancelSelectTilePressed = api.wasPressed(this.bindableCancelSelectLocation) && gameScreen.isMouseWithin();
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
                game.updateView(IGame_1.RenderSource.Mod, false);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTG9jYXRpb25TZWxlY3Rvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9Mb2NhdGlvblNlbGVjdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztJQWVBLE1BQXFCLGNBQWM7UUFBbkM7WUFrQlMsZUFBVSxHQUFHLEtBQUssQ0FBQztZQUduQixtQkFBYyxHQUFHLEtBQUssQ0FBQztRQXlHaEMsQ0FBQztRQTNHQSxJQUFXLFNBQVMsS0FBSyxPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1FBYTNDLE1BQU07WUFDWixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztZQUN2QixPQUFPLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLDJCQUFpQixFQUFXO2lCQUM3RCxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3pCLENBQUM7UUFRTSxVQUFVLENBQUMsV0FBcUIsRUFBRSxHQUFtQjtZQUMzRCxNQUFNLGlCQUFpQixHQUFHLEdBQUcsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLHNCQUFzQixDQUFDLElBQUksVUFBVyxDQUFDLGFBQWEsRUFBRSxDQUFDO1lBQ3JHLE1BQU0sdUJBQXVCLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsNEJBQTRCLENBQUMsSUFBSSxVQUFXLENBQUMsYUFBYSxFQUFFLENBQUM7WUFHakgsSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO2dCQUNuQixxQkFBVyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxrQkFBUSxDQUFDLGFBQWEsQ0FBQyxDQUFDO2dCQUVuRSxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUM7YUFDdEI7WUFFRCxJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUU7Z0JBQ3BCLE1BQU0sWUFBWSxHQUFHLFFBQVEsQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMs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