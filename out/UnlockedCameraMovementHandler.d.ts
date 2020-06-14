import Bindable from "newui/input/Bindable";
import Vector2 from "utilities/math/Vector2";
import type DebugTools from "./DebugTools";
export default class UnlockedCameraMovementHandler {
    readonly DEBUG_TOOLS: DebugTools;
    readonly bindMoveCameraUp: Bindable;
    readonly bindMoveCameraLeft: Bindable;
    readonly bindMoveCameraDown: Bindable;
    readonly bindMoveCameraRight: Bindable;
    velocity: Vector2;
    position: Vector2;
    transition?: Vector2;
    homingVelocity: number;
    private running;
    begin(): void;
    end(): void;
    tick(): void;
}
