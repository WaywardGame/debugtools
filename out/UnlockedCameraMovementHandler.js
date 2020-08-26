var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "game/IGame", "mod/Mod", "mod/ModRegistry", "newui/input/IInput", "newui/input/InputManager", "newui/screen/screens/GameScreen", "utilities/math/Vector2", "./IDebugTools"], function (require, exports, IGame_1, Mod_1, ModRegistry_1, IInput_1, InputManager_1, GameScreen_1, Vector2_1, IDebugTools_1) {
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
            if (!this.running || !renderer)
                return;
            setTimeout(this.tick, game.interval);
            let friction = STOP_FRICTION;
            if (!this.transition) {
                if (InputManager_1.default.input.isHolding(this.bindMoveCameraLeft)) {
                    this.velocity.x -= ACCELERATION / renderer.getTileScale();
                    friction = MOVE_FRICTION;
                }
                if (InputManager_1.default.input.isHolding(this.bindMoveCameraRight)) {
                    this.velocity.x += ACCELERATION / renderer.getTileScale();
                    friction = MOVE_FRICTION;
                }
                if (InputManager_1.default.input.isHolding(this.bindMoveCameraUp)) {
                    this.velocity.y -= ACCELERATION / renderer.getTileScale();
                    friction = MOVE_FRICTION;
                }
                if (InputManager_1.default.input.isHolding(this.bindMoveCameraDown)) {
                    this.velocity.y += ACCELERATION / renderer.getTileScale();
                    friction = MOVE_FRICTION;
                }
            }
            this.velocity.multiply(friction);
            const beforePosition = this.position.raw();
            this.position.add(this.velocity).mod(game.mapSize);
            if (this.transition) {
                this.homingVelocity += 0.01;
                this.homingVelocity *= 0.98;
                this.position.add(new Vector2_1.default(this.transition).subtract(this.position).multiply(this.homingVelocity));
            }
            if (!this.position.equals(beforePosition)) {
                GameScreen_1.gameScreen === null || GameScreen_1.gameScreen === void 0 ? void 0 : GameScreen_1.gameScreen.worldTooltipHandler.updatePosition();
                game.updateView(IGame_1.RenderSource.Mod, false);
            }
        }
    }
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
        Bound
    ], UnlockedCameraMovementHandler.prototype, "tick", null);
    exports.default = UnlockedCameraMovementHandler;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVW5sb2NrZWRDYW1lcmFNb3ZlbWVudEhhbmRsZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvVW5sb2NrZWRDYW1lcmFNb3ZlbWVudEhhbmRsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0lBV0EsTUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDO0lBQzFCLE1BQU0sYUFBYSxHQUFHLElBQUksQ0FBQztJQUMzQixNQUFNLGFBQWEsR0FBRyxHQUFHLENBQUM7SUFFMUIsTUFBcUIsNkJBQTZCO1FBQWxEO1lBc0JRLGFBQVEsR0FBRyxpQkFBTyxDQUFDLElBQUksQ0FBQztZQUN4QixhQUFRLEdBQUcsaUJBQU8sQ0FBQyxJQUFJLENBQUM7WUFFeEIsbUJBQWMsR0FBRyxDQUFDLENBQUM7WUFDbEIsWUFBTyxHQUFHLEtBQUssQ0FBQztRQTZEekIsQ0FBQztRQTNETyxLQUFLO1lBQ1gsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7WUFDcEIsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ2IsQ0FBQztRQUVNLEdBQUc7WUFDVCxJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztRQUN0QixDQUFDO1FBS2EsSUFBSTtZQUNqQixJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sSUFBSSxDQUFDLFFBQVE7Z0JBQzdCLE9BQU87WUFFUixVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7WUFFckMsSUFBSSxRQUFRLEdBQUcsYUFBYSxDQUFDO1lBRTdCLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFO2dCQUNyQixJQUFJLHNCQUFZLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsRUFBRTtvQkFDMUQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksWUFBWSxHQUFHLFFBQVEsQ0FBQyxZQUFZLEVBQUUsQ0FBQztvQkFDMUQs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