var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "game/IGame", "mod/IHookHost", "mod/IHookManager", "mod/Mod", "mod/ModRegistry", "utilities/TileHelpers", "./IDebugTools", "./overlay/Overlays", "./util/CancelablePromise"], function (require, exports, IGame_1, IHookHost_1, IHookManager_1, Mod_1, ModRegistry_1, TileHelpers_1, IDebugTools_1, Overlays_1, CancelablePromise_1) {
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
            let updateRender = false;
            if (this._selecting) {
                const tilePosition = renderer.screenToTile(api.mouseX, api.mouseY);
                const tile = game.getTile(tilePosition.x, tilePosition.y, localPlayer.z);
                if (tile !== this.hoverTile) {
                    updateRender = true;
                    if (this.hoverTile) {
                        TileHelpers_1.default.Overlay.remove(this.hoverTile, Overlays_1.default.isHoverTarget);
                    }
                    this.hoverTile = tile;
                    TileHelpers_1.default.Overlay.add(tile, { type: this.DEBUG_TOOLS.overlayTarget }, Overlays_1.default.isHoverTarget);
                }
                if (cancelSelectTilePressed && !bindPressed) {
                    updateRender = true;
                    if (this.selectionPromise)
                        this.selectionPromise.cancel();
                    else
                        this.cancel();
                    bindPressed = this.bindableCancelSelectLocation;
                }
                else if (selectTilePressed && !bindPressed) {
                    updateRender = true;
                    this.selectTile(tilePosition);
                    bindPressed = this.bindableSelectLocation;
                    this.selectTileHeld = true;
                }
            }
            else if (this.hoverTile) {
                TileHelpers_1.default.Overlay.remove(this.hoverTile, Overlays_1.default.isHoverTarget);
                delete this.hoverTile;
                updateRender = true;
            }
            if (updateRender) {
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
        Bound
    ], SelectLocation.prototype, "cancel", null);
    exports.default = SelectLocation;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTG9jYXRpb25TZWxlY3Rvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9Mb2NhdGlvblNlbGVjdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztJQWVBLE1BQXFCLGNBQWM7UUFBbkM7WUFrQlMsZUFBVSxHQUFHLEtBQUssQ0FBQztZQUduQixtQkFBYyxHQUFHLEtBQUssQ0FBQztRQTJIaEMsQ0FBQztRQTdIQSxJQUFXLFNBQVMsS0FBSyxPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1FBYTNDLE1BQU07WUFDWixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztZQUN2QixPQUFPLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLDJCQUFpQixFQUFXO2lCQUM3RCxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3pCLENBQUM7UUFRTSxVQUFVLENBQUMsV0FBcUIsRUFBRSxHQUFtQjtZQUMzRCxNQUFNLGlCQUFpQixHQUFHLEdBQUcsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLHNCQUFzQixDQUFDLElBQUksVUFBVyxDQUFDLGFBQWEsRUFBRSxDQUFDO1lBQ3JHLE1BQU0sdUJBQXVCLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsNEJBQTRCLENBQUMsSUFBSSxVQUFXLENBQUMsYUFBYSxFQUFFLENBQUM7WUFFakgsSUFBSSxZQUFZLEdBQUcsS0FBSyxDQUFDO1lBRXpCLElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRTtnQkFDcEIsTUFBTSxZQUFZLEdBQUcsUUFBUSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFHbkUsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQyxFQUFFLFlBQVksQ0FBQyxDQUFDLEVBQUUsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFD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