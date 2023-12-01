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
define(["require", "exports", "@wayward/game/mod/Mod", "@wayward/game/mod/ModRegistry", "@wayward/game/renderer/IRenderer", "@wayward/game/ui/input/IInput", "@wayward/game/ui/input/InputManager", "@wayward/game/utilities/math/Vector2", "@wayward/utilities/Decorators", "./IDebugTools"], function (require, exports, Mod_1, ModRegistry_1, IRenderer_1, IInput_1, InputManager_1, Vector2_1, Decorators_1, IDebugTools_1) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVW5sb2NrZWRDYW1lcmFNb3ZlbWVudEhhbmRsZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvVW5sb2NrZWRDYW1lcmFNb3ZlbWVudEhhbmRsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7OztHQVNHOzs7Ozs7Ozs7O0lBY0gsTUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDO0lBQzFCLE1BQU0sYUFBYSxHQUFHLElBQUksQ0FBQztJQUMzQixNQUFNLGFBQWEsR0FBRyxHQUFHLENBQUM7SUFFMUIsTUFBcUIsNkJBQTZCO1FBQWxEO1lBc0JRLGFBQVEsR0FBRyxpQkFBTyxDQUFDLElBQUksQ0FBQztZQUN4QixhQUFRLEdBQUcsaUJBQU8sQ0FBQyxJQUFJLENBQUM7WUFFeEIsbUJBQWMsR0FBRyxDQUFDLENBQUM7WUFDbEIsWUFBTyxHQUFHLEtBQUssQ0FBQztRQThEekIsQ0FBQztRQTVETyxLQUFLO1lBQ1gsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7WUFDcEIsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ2IsQ0FBQztRQUVNLEdBQUc7WUFDVCxJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztRQUN0QixDQUFDO1FBS2EsSUFBSTtZQUNqQixJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sSUFBSSxDQUFDLFFBQVEsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO2dCQUNoRCxPQUFPO1lBQ1IsQ0FBQztZQUVELFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUVyQyxJQUFJLFFBQVEsR0FBRyxhQUFhLENBQUM7WUFFN0IsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztnQkFDdEIsSUFBSSxzQkFBWSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLEVBQUUsQ0FBQztvQkFDM0QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksWUFBWSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsWUFBWSxFQUFFLENBQUM7b0JBQ3hFLFFBQVEsR0FBRyxhQUFhLENBQUM7Z0JBQzFCLENBQUM7Z0JBRUQsSUFBSSxzQkFBWSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLEVBQUUsQ0FBQztvQkFDNUQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksWUFBWSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsWUFBWSxFQUFFLENBQUM7b0JBQ3hFLFFBQVEsR0FBRyxhQUFhLENBQUM7Z0JBQzFCLENBQUM7Z0JBRUQsSUFBSSxzQkFBWSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEVBQUUsQ0FBQztvQkFDekQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksWUFBWSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsWUFBWSxFQUFFLENBQUM7b0JBQ3hFLFFBQVEsR0FBRyxhQUFhLENBQUM7Z0JBQzFCLENBQUM7Z0JBRUQsSUFBSSxzQkFBWSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLEVBQUUsQ0FBQztvQkFDM0QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksWUFBWSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsWUFBWSxFQUFFLENBQUM7b0JBQ3hFLFFBQVEsR0FBRyxhQUFhLENBQUM7Z0JBQzFCLENBQUM7WUFDRixDQUFDO1lBRUQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUM7WUFFakMsTUFBTSxjQUFjLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsQ0FBQztZQUMzQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUcxRCxJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztnQkFDckIsSUFBSSxDQUFDLGNBQWMsSUFBSSxJQUFJLENBQUM7Z0JBQzVCLElBQUksQ0FBQyxjQUFjLElBQUksSUFBSSxDQUFDO2dCQUM1QixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxJQUFJLGlCQUFPLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDO1lBQ3ZHLENBQUM7WUFFRCxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLEVBQUUsQ0FBQztnQkFDM0MsVUFBVSxFQUFFLG1CQUFtQixFQUFFLENBQUMsZ0JBQWdCLENBQUMsRUFBRSxDQUFDO2dCQUN0RCxXQUFXLENBQUMsVUFBVSxDQUFDLHdCQUFZLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQ2pELENBQUM7UUFDRixDQUFDO0tBQ0Q7SUF4RkQsZ0RBd0ZDO0lBckZnQjtRQURmLGFBQUcsQ0FBQyxRQUFRLENBQWEsNEJBQWMsQ0FBQztzRUFDRDtJQU94QjtRQURmLHFCQUFRLENBQUMsUUFBUSxDQUFDLGNBQWMsRUFBRSxlQUFNLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQzsyRUFDbEI7SUFFM0I7UUFEZixxQkFBUSxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsRUFBRSxlQUFNLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQzs2RUFDbEI7SUFFN0I7UUFEZixxQkFBUSxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsRUFBRSxlQUFNLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQzs2RUFDbEI7SUFFN0I7UUFEZixxQkFBUSxDQUFDLFFBQVEsQ0FBQyxpQkFBaUIsRUFBRSxlQUFNLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQzs4RUFDbEI7SUF3QmhDO1FBQWIsa0JBQUs7NkRBK0NMIn0=