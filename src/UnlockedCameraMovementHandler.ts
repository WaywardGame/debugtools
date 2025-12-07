import Mod from "@wayward/game/mod/Mod";
import { RenderSource } from "@wayward/game/renderer/IRenderer";
import { IInput } from "@wayward/game/ui/input/IInput";
import InputManager from "@wayward/game/ui/input/InputManager";
import Vector2 from "@wayward/game/utilities/math/Vector2";
import { Bound } from "@wayward/utilities/Decorators";

const ACCELERATION = 0.12;
const MOVE_FRICTION = 0.98;
const STOP_FRICTION = 0.9;

const bindMoveCameraUp = Mod.register.bindable("CameraMoveUp", IInput.key("KeyW", "Alt"));
const bindMoveCameraLeft = Mod.register.bindable("CameraMoveLeft", IInput.key("KeyA", "Alt"));
const bindMoveCameraDown = Mod.register.bindable("CameraMoveDown", IInput.key("KeyS", "Alt"));
const bindMoveCameraRight = Mod.register.bindable("CameraMoveRight", IInput.key("KeyD", "Alt"));

export default class UnlockedCameraMovementHandler {

	public velocity = Vector2.ZERO;
	public position = Vector2.ZERO;
	public transition?: Vector2;
	public homingVelocity = 0;
	private running = false;

	public begin(): void {
		this.running = true;
		this.tick();
	}

	public end(): void {
		this.running = false;
	}

	/**
	 * Simple velocity movement implementation
	 */
	@Bound public tick(): void {
		if (!this.running || !renderer || !localIsland) {
			return;
		}

		setTimeout(this.tick, game.interval);

		let friction = STOP_FRICTION;

		if (!this.transition) {
			if (InputManager.input.isHolding(bindMoveCameraLeft.value)) {
				this.velocity.x -= ACCELERATION / renderer.worldRenderer.getTileScale();
				friction = MOVE_FRICTION;
			}

			if (InputManager.input.isHolding(bindMoveCameraRight.value)) {
				this.velocity.x += ACCELERATION / renderer.worldRenderer.getTileScale();
				friction = MOVE_FRICTION;
			}

			if (InputManager.input.isHolding(bindMoveCameraUp.value)) {
				this.velocity.y -= ACCELERATION / renderer.worldRenderer.getTileScale();
				friction = MOVE_FRICTION;
			}

			if (InputManager.input.isHolding(bindMoveCameraDown.value)) {
				this.velocity.y += ACCELERATION / renderer.worldRenderer.getTileScale();
				friction = MOVE_FRICTION;
			}
		}

		this.velocity.multiply(friction);

		const beforePosition = this.position.raw();
		this.position.add(this.velocity).mod(localIsland.mapSize);

		// homes in on the player again if in the 'transition' state
		if (this.transition) {
			this.homingVelocity += 0.01;
			this.homingVelocity *= 0.98;
			this.position.add(new Vector2(this.transition).subtract(this.position).multiply(this.homingVelocity));
		}

		if (!this.position.equals(beforePosition)) {
			gameScreen?.worldTooltipHandler?.["updatePosition"]();
			localPlayer.updateView(RenderSource.Mod, false);
		}
	}
}
