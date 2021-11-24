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
            var _a;
            if (!this.running || !renderer)
                return;
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
            this.position.add(this.velocity).mod(game.mapSize);
            if (this.transition) {
                this.homingVelocity += 0.01;
                this.homingVelocity *= 0.98;
                this.position.add(new Vector2_1.default(this.transition).subtract(this.position).multiply(this.homingVelocity));
            }
            if (!this.position.equals(beforePosition)) {
                (_a = gameScreen === null || gameScreen === void 0 ? void 0 : gameScreen.worldTooltipHandler) === null || _a === void 0 ? void 0 : _a["updatePosition"]();
                game.updateView(IRenderer_1.RenderSource.Mod, false);
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
        Decorators_1.Bound
    ], UnlockedCameraMovementHandler.prototype, "tick", null);
    exports.default = UnlockedCameraMovementHandler;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVW5sb2NrZWRDYW1lcmFNb3ZlbWVudEhhbmRsZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvVW5sb2NrZWRDYW1lcmFNb3ZlbWVudEhhbmRsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0lBWUEsTUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDO0lBQzFCLE1BQU0sYUFBYSxHQUFHLElBQUksQ0FBQztJQUMzQixNQUFNLGFBQWEsR0FBRyxHQUFHLENBQUM7SUFFMUIsTUFBcUIsNkJBQTZCO1FBQWxEO1lBc0JRLGFBQVEsR0FBRyxpQkFBTyxDQUFDLElBQUksQ0FBQztZQUN4QixhQUFRLEdBQUcsaUJBQU8sQ0FBQyxJQUFJLENBQUM7WUFFeEIsbUJBQWMsR0FBRyxDQUFDLENBQUM7WUFDbEIsWUFBTyxHQUFHLEtBQUssQ0FBQztRQTZEekIsQ0FBQztRQTNETyxLQUFLO1lBQ1gsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7WUFDcEIsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ2IsQ0FBQztRQUVNLEdBQUc7WUFDVCxJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztRQUN0QixDQUFDO1FBS2EsSUFBSTs7WUFDakIsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLElBQUksQ0FBQyxRQUFRO2dCQUM3QixPQUFPO1lBRVIsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBRXJDLElBQUksUUFBUSxHQUFHLGFBQWEsQ0FBQztZQUU3QixJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRTtnQkFDckIsSUFBSSxzQkFBWSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLEVBQUU7b0JBQzFELElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLFlBQVksR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFlBQVksRUFBRSxD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