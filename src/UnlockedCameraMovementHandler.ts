import Mod from "mod/Mod";
import Register from "mod/ModRegistry";
import { RenderSource } from "renderer/IRenderer";
import Bindable from "ui/input/Bindable";
import { IInput } from "ui/input/IInput";
import InputManager from "ui/input/InputManager";
import Vector2 from "utilities/math/Vector2";
import { Bound } from "utilities/Decorators";

import type DebugTools from "./DebugTools";
import { DEBUG_TOOLS_ID } from "./IDebugTools";

const ACCELERATION = 0.12;
const MOVE_FRICTION = 0.98;
const STOP_FRICTION = 0.9;

export default class UnlockedCameraMovementHandler {

	@Mod.instance<DebugTools>(DEBUG_TOOLS_ID)
	public readonly DEBUG_TOOLS: DebugTools;

	////////////////////////////////////
	// Registrations
	//

	@Register.bindable("CameraMoveUp", IInput.key("KeyW", "Alt"))
	public readonly bindMoveCameraUp: Bindable;
	@Register.bindable("CameraMoveLeft", IInput.key("KeyA", "Alt"))
	public readonly bindMoveCameraLeft: Bindable;
	@Register.bindable("CameraMoveDown", IInput.key("KeyS", "Alt"))
	public readonly bindMoveCameraDown: Bindable;
	@Register.bindable("CameraMoveRight", IInput.key("KeyD", "Alt"))
	public readonly bindMoveCameraRight: Bindable;

	////////////////////////////////////
	// Fields
	//

	public velocity = Vector2.ZERO;
	public position = Vector2.ZERO;
	public transition?: Vector2;
	public homingVelocity = 0;
	private running = false;

	public begin() {
		this.running = true;
		this.tick();
	}

	public end() {
		this.running = false;
	}

	/**
	 * Simple velocity movement implementation
	 */
	@Bound public tick() {
		if (!this.running || !renderer)
			return;

		setTimeout(this.tick, game.interval);

		let friction = STOP_FRICTION;

		if (!this.transition) {
			if (InputManager.input.isHolding(this.bindMoveCameraLeft)) {
				this.velocity.x -= ACCELERATION / renderer.worldRenderer.getTileScale();
				friction = MOVE_FRICTION;
			}

			if (InputManager.input.isHolding(this.bindMoveCameraRight)) {
				this.velocity.x += ACCELERATION / renderer.worldRenderer.getTileScale();
				friction = MOVE_FRICTION;
			}

			if (InputManager.input.isHolding(this.bindMoveCameraUp)) {
				this.velocity.y -= ACCELERATION / renderer.worldRenderer.getTileScale();
				friction = MOVE_FRICTION;
			}

			if (InputManager.input.isHolding(this.bindMoveCameraDown)) {
				this.velocity.y += ACCELERATION / renderer.worldRenderer.getTileScale();
				friction = MOVE_FRICTION;
			}
		}

		this.velocity.multiply(friction);

		const beforePosition = this.position.raw();
		this.position.add(this.velocity).mod(game.mapSize);

		// homes in on the player again if in the 'transition' state
		if (this.transition) {
			this.homingVelocity += 0.01;
			this.homingVelocity *= 0.98;
			this.position.add(new Vector2(this.transition).subtract(this.position).multiply(this.homingVelocity));
		}

		if (!this.position.equals(beforePosition)) {
			gameScreen?.worldTooltipHandler?.["updatePosition"]();
			renderers.updateView(RenderSource.Mod, false);
		}
	}
}
