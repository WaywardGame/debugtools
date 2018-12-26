var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "game/IGame", "mod/ModRegistry", "newui/BindingManager", "utilities/math/Vector2"], function (require, exports, IGame_1, ModRegistry_1, BindingManager_1, Vector2_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const ACCELERATION = 0.12;
    const MOVE_FRICTION = 0.98;
    const STOP_FRICTION = 0.9;
    class UnlockedCameraMovementHandler {
        constructor() {
            this.velocity = Vector2_1.default.ZERO;
            this.homingVelocity = 0;
        }
        handle(bindPressed, api) {
            let friction = STOP_FRICTION;
            if (!this.transition) {
                if (api.isDown(this.bindMoveCameraLeft)) {
                    this.velocity.x -= ACCELERATION / renderer.getTileScale();
                    friction = MOVE_FRICTION;
                }
                if (api.isDown(this.bindMoveCameraRight)) {
                    this.velocity.x += ACCELERATION / renderer.getTileScale();
                    friction = MOVE_FRICTION;
                }
                if (api.isDown(this.bindMoveCameraUp)) {
                    this.velocity.y -= ACCELERATION / renderer.getTileScale();
                    friction = MOVE_FRICTION;
                }
                if (api.isDown(this.bindMoveCameraDown)) {
                    this.velocity.y += ACCELERATION / renderer.getTileScale();
                    friction = MOVE_FRICTION;
                }
            }
            this.velocity.multiply(friction);
            this.position.add(this.velocity).mod(game.mapSize);
            if (this.transition) {
                this.homingVelocity += 0.01;
                this.homingVelocity *= 0.98;
                this.position.add(new Vector2_1.default(this.transition).subtract(this.position).multiply(this.homingVelocity));
            }
            game.updateView(IGame_1.RenderSource.Mod, false);
            return bindPressed;
        }
    }
    __decorate([
        ModRegistry_1.default.bindable("CameraMoveUp", { key: "KeyW", modifiers: [BindingManager_1.KeyModifier.Alt] })
    ], UnlockedCameraMovementHandler.prototype, "bindMoveCameraUp", void 0);
    __decorate([
        ModRegistry_1.default.bindable("CameraMoveLeft", { key: "KeyA", modifiers: [BindingManager_1.KeyModifier.Alt] })
    ], UnlockedCameraMovementHandler.prototype, "bindMoveCameraLeft", void 0);
    __decorate([
        ModRegistry_1.default.bindable("CameraMoveDown", { key: "KeyS", modifiers: [BindingManager_1.KeyModifier.Alt] })
    ], UnlockedCameraMovementHandler.prototype, "bindMoveCameraDown", void 0);
    __decorate([
        ModRegistry_1.default.bindable("CameraMoveRight", { key: "KeyD", modifiers: [BindingManager_1.KeyModifier.Alt] })
    ], UnlockedCameraMovementHandler.prototype, "bindMoveCameraRight", void 0);
    exports.default = UnlockedCameraMovementHandler;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVW5sb2NrZWRDYW1lcmFNb3ZlbWVudEhhbmRsZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvVW5sb2NrZWRDYW1lcmFNb3ZlbWVudEhhbmRsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0lBTUEsTUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDO0lBQzFCLE1BQU0sYUFBYSxHQUFHLElBQUksQ0FBQztJQUMzQixNQUFNLGFBQWEsR0FBRyxHQUFHLENBQUM7SUFFMUIsTUFBcUIsNkJBQTZCO1FBQWxEO1lBbUJRLGFBQVEsR0FBRyxpQkFBTyxDQUFDLElBQUksQ0FBQztZQUd4QixtQkFBYyxHQUFHLENBQUMsQ0FBQztRQTZDM0IsQ0FBQztRQXhDTyxNQUFNLENBQUMsV0FBcUIsRUFBRSxHQUFtQjtZQUN2RCxJQUFJLFFBQVEsR0FBRyxhQUFhLENBQUM7WUFFN0IsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUU7Z0JBQ3JCLElBQUksR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsRUFBRTtvQkFDeEMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksWUFBWSxHQUFHLFFBQVEsQ0FBQyxZQUFZLEVBQUUsQ0FBQztvQkFDMUQsUUFBUSxHQUFHLGFBQWEsQ0FBQztpQkFDekI7Z0JBRUQsSUFBSSxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxFQUFFO29CQUN6QyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxZQUFZLEdBQUcsUUFBUSxDQUFDLFlBQVksRUFBRSxDQUFDO29CQUMxRCxRQUFRLEdBQUcsYUFBYSxDQUFDO2lCQUN6QjtnQkFFRCxJQUFJLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEVBQUU7b0JBQ3RDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLFlBQVksR0FBRyxRQUFRLENBQUMsWUFBWSxFQUFFLENBQUM7b0JBQzFELFFBQVEsR0FBRyxhQUFhLENBQUM7aUJBQ3pCO2dCQUVELElBQUksR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsRUFBRTtvQkFDeEMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksWUFBWSxHQUFHLFFBQVEsQ0FBQyxZQUFZLEVBQUUsQ0FBQztvQkFDMUQsUUFBUSxHQUFHLGFBQWEsQ0FBQztpQkFDekI7YUFDRDtZQUVELElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBRWpDLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBR25ELElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRTtnQkFDcEIsSUFBSSxDQUFDLGNBQWMsSUFBSSxJQUFJLENBQUM7Z0JBQzVCLElBQUksQ0FBQyxjQUFjLElBQUksSUFBSSxDQUFDO2dCQUM1QixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxJQUFJLGlCQUFPLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDO2FBQ3RHO1lBRUQsSUFBSSxDQUFDLFVBQVUsQ0FBQyxvQkFBWSxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQztZQUV6QyxPQUFPLFdBQVcsQ0FBQztRQUNwQixDQUFDO0tBQ0Q7SUE1REE7UUFEQyxxQkFBUSxDQUFDLFFBQVEsQ0FBQyxjQUFjLEVBQUUsRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBRSxDQUFDLDRCQUFXLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQzsyRUFDdEM7SUFFM0M7UUFEQyxxQkFBUSxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsRUFBRSxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLENBQUMsNEJBQVcsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDOzZFQUN0QztJQUU3QztRQURDLHFCQUFRLENBQUMsUUFBUSxDQUFDLGdCQUFnQixFQUFFLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsQ0FBQyw0QkFBVyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUM7NkVBQ3RDO0lBRTdDO1FBREMscUJBQVEsQ0FBQyxRQUFRLENBQUMsaUJBQWlCLEVBQUUsRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBRSxDQUFDLDRCQUFXLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQzs4RUFDdEM7SUFiL0MsZ0RBbUVDIn0=