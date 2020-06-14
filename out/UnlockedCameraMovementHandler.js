var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "game/IGame", "mod/Mod", "mod/ModRegistry", "newui/input/IBinding", "newui/input/InputManager", "utilities/math/Vector2", "./IDebugTools"], function (require, exports, IGame_1, Mod_1, ModRegistry_1, IBinding_1, InputManager_1, Vector2_1, IDebugTools_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const ACCELERATION = 0.12;
    const MOVE_FRICTION = 0.98;
    const STOP_FRICTION = 0.9;
    let UnlockedCameraMovementHandler = (() => {
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
                if (!this.running)
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
                if (!this.position.equals(beforePosition))
                    game.updateView(IGame_1.RenderSource.Mod, false);
            }
        }
        __decorate([
            Mod_1.default.instance(IDebugTools_1.DEBUG_TOOLS_ID)
        ], UnlockedCameraMovementHandler.prototype, "DEBUG_TOOLS", void 0);
        __decorate([
            ModRegistry_1.default.bindable("CameraMoveUp", IBinding_1.IBinding.key("KeyW", "Alt"))
        ], UnlockedCameraMovementHandler.prototype, "bindMoveCameraUp", void 0);
        __decorate([
            ModRegistry_1.default.bindable("CameraMoveLeft", IBinding_1.IBinding.key("KeyA", "Alt"))
        ], UnlockedCameraMovementHandler.prototype, "bindMoveCameraLeft", void 0);
        __decorate([
            ModRegistry_1.default.bindable("CameraMoveDown", IBinding_1.IBinding.key("KeyS", "Alt"))
        ], UnlockedCameraMovementHandler.prototype, "bindMoveCameraDown", void 0);
        __decorate([
            ModRegistry_1.default.bindable("CameraMoveRight", IBinding_1.IBinding.key("KeyD", "Alt"))
        ], UnlockedCameraMovementHandler.prototype, "bindMoveCameraRight", void 0);
        __decorate([
            Bound
        ], UnlockedCameraMovementHandler.prototype, "tick", null);
        return UnlockedCameraMovementHandler;
    })();
    exports.default = UnlockedCameraMovementHandler;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVW5sb2NrZWRDYW1lcmFNb3ZlbWVudEhhbmRsZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvVW5sb2NrZWRDYW1lcmFNb3ZlbWVudEhhbmRsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0lBVUEsTUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDO0lBQzFCLE1BQU0sYUFBYSxHQUFHLElBQUksQ0FBQztJQUMzQixNQUFNLGFBQWEsR0FBRyxHQUFHLENBQUM7SUFFMUI7UUFBQSxNQUFxQiw2QkFBNkI7WUFBbEQ7Z0JBc0JRLGFBQVEsR0FBRyxpQkFBTyxDQUFDLElBQUksQ0FBQztnQkFDeEIsYUFBUSxHQUFHLGlCQUFPLENBQUMsSUFBSSxDQUFDO2dCQUV4QixtQkFBYyxHQUFHLENBQUMsQ0FBQztnQkFDbEIsWUFBTyxHQUFHLEtBQUssQ0FBQztZQTJEekIsQ0FBQztZQXpETyxLQUFLO2dCQUNYLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO2dCQUNwQixJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDYixDQUFDO1lBRU0sR0FBRztnQkFDVCxJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztZQUN0QixDQUFDO1lBS2EsSUFBSTtnQkFDakIsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPO29CQUNoQixPQUFPO2dCQUVSLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFFckMsSUFBSSxRQUFRLEdBQUcsYUFBYSxDQUFDO2dCQUU3QixJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRTtvQkFDckIsSUFBSSxzQkFBWSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLEVBQUU7d0JBQzFELElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLFlBQVksR0FBRyxRQUFRLENBQUMsWUFBWSxFQUFFLENBQUM7d0JBQzFE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