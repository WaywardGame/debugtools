var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "event/EventManager", "game/IGame", "mod/IHookHost", "mod/IHookManager", "mod/Mod", "mod/ModRegistry", "newui/screen/screens/game/util/movement/MovementHandler", "newui/screen/screens/GameScreen", "utilities/TileHelpers", "./IDebugTools", "./overlay/Overlays", "./util/CancelablePromise"], function (require, exports, EventManager_1, IGame_1, IHookHost_1, IHookManager_1, Mod_1, ModRegistry_1, MovementHandler_1, GameScreen_1, TileHelpers_1, IDebugTools_1, Overlays_1, CancelablePromise_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    let SelectLocation = class SelectLocation {
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
            if (!GameScreen_1.gameScreen) {
                return bindPressed;
            }
            const selectTilePressed = api.wasPressed(this.bindableSelectLocation) && GameScreen_1.gameScreen.isMouseWithin();
            const cancelSelectTilePressed = api.wasPressed(this.bindableCancelSelectLocation) && GameScreen_1.gameScreen.isMouseWithin();
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
        canClientMove() {
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
    };
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
        EventManager_1.EventHandler(MovementHandler_1.default, "canMove")
    ], SelectLocation.prototype, "canClientMove", null);
    __decorate([
        Bound
    ], SelectLocation.prototype, "cancel", null);
    SelectLocation = __decorate([
        EventManager_1.EventSubscriber
    ], SelectLocation);
    exports.default = SelectLocation;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTG9jYXRpb25TZWxlY3Rvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9Mb2NhdGlvblNlbGVjdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztJQWtCQSxJQUFxQixjQUFjLEdBQW5DLE1BQXFCLGNBQWM7UUFBbkM7WUFrQlMsZUFBVSxHQUFHLEtBQUssQ0FBQztZQUduQixtQkFBYyxHQUFHLEtBQUssQ0FBQztRQStIaEMsQ0FBQztRQWpJQSxJQUFXLFNBQVMsS0FBSyxPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1FBYTNDLE1BQU07WUFDWixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztZQUN2QixPQUFPLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLDJCQUFpQixFQUFXO2lCQUM3RCxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3pCLENBQUM7UUFRTSxVQUFVLENBQUMsV0FBcUIsRUFBRSxHQUFtQjtZQUMzRCxJQUFJLENBQUMsdUJBQVUsRUFBRTtnQkFDaEIsT0FBTyxXQUFXLENBQUM7YUFDbkI7WUFFRCxNQUFNLGlCQUFpQixHQUFHLEdBQUcsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLHNCQUFzQixDQUFDLElBQUksdUJBQVUsQ0FBQyxhQUFhLEVBQUUsQ0FBQztZQUNwRyxNQUFNLHVCQUF1QixHQUFHLEdBQUcsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLDRCQUE0QixDQUFDLElBQUksdUJBQVUsQ0FBQyxhQUFhLEVBQUUsQ0FBQztZQUVoSCxJQUFJLFlBQVksR0FBRyxLQUFLLENBQUM7WUFFekIsSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFO2dCQUNwQixNQUFNLFlBQVksR0FBRyxRQUFRLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUduRSxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMs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