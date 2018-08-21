import { Bindable } from "Enums";
import Register from "mod/ModRegistry";
import { BindCatcherApi, KeyModifier } from "newui/BindingManager";
import Vector2 from "utilities/math/Vector2";

const ACCELERATION = 0.12;
const MOVE_FRICTION = 0.98;
const STOP_FRICTION = 0.9;

export default class UnlockedCameraMovementHandler {

	@Register.bindable("CameraMoveUp", { key: "KeyW", modifiers: [KeyModifier.Alt] })
	public bindMoveCameraUp: Bindable;
	@Register.bindable("CameraMoveLeft", { key: "KeyA", modifiers: [KeyModifier.Alt] })
	public bindMoveCameraLeft: Bindable;
	@Register.bindable("CameraMoveDown", { key: "KeyS", modifiers: [KeyModifier.Alt] })
	public bindMoveCameraDown: Bindable;
	@Register.bindable("CameraMoveRight", { key: "KeyD", modifiers: [KeyModifier.Alt] })
	public bindMoveCameraRight: Bindable;

	public velocity = Vector2.ZERO;
	public position: Vector2;
	public transition?: Vector2;
	public homingVelocity = 0;

	public handle(bindPressed: Bindable, api: BindCatcherApi) {
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
			this.position.add(new Vector2(this.transition).subtract(this.position).multiply(this.homingVelocity));
		}

		game.updateView(false);

		return bindPressed;
	}
}