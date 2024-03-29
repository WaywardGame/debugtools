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
define(["require", "exports", "mod/Mod", "mod/ModRegistry", "renderer/IRenderer", "ui/input/IInput", "ui/input/InputManager", "utilities/math/Vector2", "utilities/Decorators", "./IDebugTools"], function (require, exports, Mod_1, ModRegistry_1, IRenderer_1, IInput_1, InputManager_1, Vector2_1, Decorators_1, IDebugTools_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const ACCELERATION = 0.12;
    const MOVE_FRICTION = 0.98;
    const STOP_FRICTION = 0.9;
    class UnlockedCameraMovementHandler {
        constructor() {
            this.velocity = Vector2_1.default.ZERO;
            this.position = Vector2_1.default.ZERO;
            this.homingVelocity = 0;
            this.running = false;
        }
        begin() {
            this.running = true;
            this.tick();
        }
        end() {
            this.running = false;
        }
        tick() {
            if (!this.running || !renderer || !localIsland) {
                return;
            }
            setTimeout(this.tick, game.interval);
            let friction = STOP_FRICTION;
            if (!this.transition) {
                if (InputManager_1.default.input.isHolding(this.bindMoveCameraLeft)) {
                    this.velocity.x -= ACCELERATION / renderer.worldRenderer.getTileScale();
                    friction = MOVE_FRICTION;
                }
                if (InputManager_1.default.input.isHolding(this.bindMoveCameraRight)) {
                    this.velocity.x += ACCELERATION / renderer.worldRenderer.getTileScale();
                    friction = MOVE_FRICTION;
                }
                if (InputManager_1.default.input.isHolding(this.bindMoveCameraUp)) {
                    this.velocity.y -= ACCELERATION / renderer.worldRenderer.getTileScale();
                    friction = MOVE_FRICTION;
                }
                if (InputManager_1.default.input.isHolding(this.bindMoveCameraDown)) {
                    this.velocity.y += ACCELERATION / renderer.worldRenderer.getTileScale();
                    friction = MOVE_FRICTION;
                }
            }
            this.velocity.multiply(friction);
            const beforePosition = this.position.raw();
            this.position.add(this.velocity).mod(localIsland.mapSize);
            if (this.transition) {
                this.homingVelocity += 0.01;
                this.homingVelocity *= 0.98;
                this.position.add(new Vector2_1.default(this.transition).subtract(this.position).multiply(this.homingVelocity));
            }
            if (!this.position.equals(beforePosition)) {
                gameScreen?.worldTooltipHandler?.["updatePosition"]();
                localPlayer.updateView(IRenderer_1.RenderSource.Mod, false);
            }
        }
    }
    exports.default = UnlockedCameraMovementHandler;
    __decorate([
        Mod_1.default.instance(IDebugTools_1.DEBUG_TOOLS_ID)
    ], UnlockedCameraMovementHandler.prototype, "DEBUG_TOOLS", void 0);
    __decorate([
        ModRegistry_1.default.bindable("CameraMoveUp", IInput_1.IInput.key("KeyW", "Alt"))
    ], UnlockedCameraMovementHandler.prototype, "bindMoveCameraUp", void 0);
    __decorate([
        ModRegistry_1.default.bindable("CameraMoveLeft", IInput_1.IInput.key("KeyA", "Alt"))
    ], UnlockedCameraMovementHandler.prototype, "bindMoveCameraLeft", void 0);
    __decorate([
        ModRegistry_1.default.bindable("CameraMoveDown", IInput_1.IInput.key("KeyS", "Alt"))
    ], UnlockedCameraMovementHandler.prototype, "bindMoveCameraDown", void 0);
    __decorate([
        ModRegistry_1.default.bindable("CameraMoveRight", IInput_1.IInput.key("KeyD", "Alt"))
    ], UnlockedCameraMovementHandler.prototype, "bindMoveCameraRight", void 0);
    __decorate([
        Decorators_1.Bound
    ], UnlockedCameraMovementHandler.prototype, "tick", null);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVW5sb2NrZWRDYW1lcmFNb3ZlbWVudEhhbmRsZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvVW5sb2NrZWRDYW1lcmFNb3ZlbWVudEhhbmRsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7OztHQVNHOzs7Ozs7Ozs7O0lBY0gsTUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDO0lBQzFCLE1BQU0sYUFBYSxHQUFHLElBQUksQ0FBQztJQUMzQixNQUFNLGFBQWEsR0FBRyxHQUFHLENBQUM7SUFFMUIsTUFBcUIsNkJBQTZCO1FBQWxEO1lBc0JRLGFBQVEsR0FBRyxpQkFBTyxDQUFDLElBQUksQ0FBQztZQUN4QixhQUFRLEdBQUcsaUJBQU8sQ0FBQyxJQUFJLENBQUM7WUFFeEIsbUJBQWMsR0FBRyxDQUFDLENBQUM7WUFDbEIsWUFBTyxHQUFHLEtBQUssQ0FBQztRQThEekIsQ0FBQztRQTVETyxLQUFLO1lBQ1gsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7WUFDcEIsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ2IsQ0FBQztRQUVNLEdBQUc7WUFDVCxJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztRQUN0QixDQUFDO1FBS2EsSUFBSTtZQUNqQixJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sSUFBSSxDQUFDLFFBQVEsSUFBSSxDQUFDLFdBQVcsRUFBRTtnQkFDL0MsT0FBTzthQUNQO1lBRUQsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBRXJDLElBQUksUUFBUSxHQUFHLGFBQWEsQ0FBQztZQUU3QixJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRTtnQkFDckIsSUFBSSxzQkFBWSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLEVBQUU7b0JBQzFELElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJ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