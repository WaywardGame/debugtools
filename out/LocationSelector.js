var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "event/EventEmitter", "event/EventManager", "game/IGame", "mod/Mod", "mod/ModRegistry", "newui/input/Bind", "newui/input/IBinding", "newui/input/InputManager", "newui/screen/screens/game/util/movement/MovementHandler", "newui/screen/screens/GameScreen", "utilities/TileHelpers", "./IDebugTools", "./overlay/Overlays", "./util/CancelablePromise"], function (require, exports, EventEmitter_1, EventManager_1, IGame_1, Mod_1, ModRegistry_1, Bind_1, IBinding_1, InputManager_1, MovementHandler_1, GameScreen_1, TileHelpers_1, IDebugTools_1, Overlays_1, CancelablePromise_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    let SelectLocation = (() => {
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
                const selectTilePressed = InputManager_1.default.input.isHolding(this.bindableSelectLocation) && (GameScreen_1.gameScreen === null || GameScreen_1.gameScreen === void 0 ? void 0 : GameScreen_1.gameScreen.isMouseWithin());
                const cancelSelectTilePressed = InputManager_1.default.input.isHolding(this.bindableCancelSelectLocation) && (GameScreen_1.gameScreen === null || GameScreen_1.gameScreen === void 0 ? void 0 : GameScreen_1.gameScreen.isMouseWithin());
                let updateRender = false;
                if (this._selecting) {
                    const tilePosition = renderer.screenToTile(...InputManager_1.default.mouse.position.xy);
                    if (tilePosition) {
                        const tile = game.getTile(tilePosition.x, tilePosition.y, localPlayer.z);
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
                    game.updateView(IGame_1.RenderSource.Mod, false);
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
            ModRegistry_1.default.bindable("SelectLocation", IBinding_1.IBinding.mouseButton(0))
        ], SelectLocation.prototype, "bindableSelectLocation", void 0);
        __decorate([
            ModRegistry_1.default.bindable("CancelSelectLocation", IBinding_1.IBinding.mouseButton(2))
        ], SelectLocation.prototype, "bindableCancelSelectLocation", void 0);
        __decorate([
            EventManager_1.EventHandler(MovementHandler_1.default, "canMove")
        ], SelectLocation.prototype, "canClientMove", null);
        __decorate([
            Bind_1.default.onDown(ModRegistry_1.Registry().get("bindableSelectLocation"), EventEmitter_1.Priority.High),
            Bind_1.default.onDown(ModRegistry_1.Registry().get("bindableCancelSelectLocation"), EventEmitter_1.Priority.High)
        ], SelectLocation.prototype, "onSelectOrCancelSelectLocation", null);
        __decorate([
            Bind_1.default.onUp(ModRegistry_1.Registry().get("bindableSelectLocation"))
        ], SelectLocation.prototype, "onStopSelectLocation", null);
        __decorate([
            Bound
        ], SelectLocation.prototype, "selectionTick", null);
        __decorate([
            Bound
        ], SelectLocation.prototype, "cancel", null);
        return SelectLocation;
    })();
    exports.default = SelectLocation;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTG9jYXRpb25TZWxlY3Rvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9Mb2NhdGlvblNlbGVjdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztJQW1CQTtRQUFBLE1BQXFCLGNBQWM7WUFBbkM7Z0JBa0JTLGVBQVUsR0FBRyxLQUFLLENBQUM7Z0JBR25CLG1CQUFjLEdBQUcsS0FBSyxDQUFDO1lBcUloQyxDQUFDO1lBdklBLElBQVcsU0FBUyxLQUFLLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7WUFhM0MsTUFBTTtnQkFDWixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztnQkFDdkIsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO2dCQUNyQixPQUFPLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLDJCQUFpQixFQUFXO3FCQUM3RCxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3pCLENBQUM7WUFVUyxhQUFhO2dCQUN0QixJQUFJLElBQUksQ0FBQyxVQUFVLElBQUksSUFBSSxDQUFDLGNBQWMsRUFBRTtvQkFDM0MsT0FBTyxLQUFLLENBQUM7aUJBQ2I7Z0JBRUQsT0FBTyxTQUFTLENBQUM7WUFDbEIsQ0FBQztZQUlTLDhCQUE4QjtnQkFDdkMsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDO1lBQ3hCLENBQUM7WUFHUyxvQkFBb0I7Z0JBQzdCLElBQUksQ0FBQyxjQUFjLEdBQUcsS0FBSyxDQUFDO2dCQUM1QixPQUFPLEtBQUssQ0FBQztZQUNkLENBQUM7WUFPYyxhQUFhO2dCQUMzQixJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVU7b0JBQ25CLE9BQU87Z0JBRVIsVUFBVSxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUU5QyxNQUFNLGlCQUFpQixHQUFHLHNCQUFZLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENB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