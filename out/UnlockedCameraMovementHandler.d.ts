import { Bindable } from "Enums";
import { BindCatcherApi } from "newui/BindingManager";
import Vector2 from "utilities/math/Vector2";
export default class UnlockedCameraMovementHandler {
    bindMoveCameraUp: Bindable;
    bindMoveCameraLeft: Bindable;
    bindMoveCameraDown: Bindable;
    bindMoveCameraRight: Bindable;
    velocity: Vector2;
    position: Vector2;
    transition?: Vector2;
    homingVelocity: number;
    handle(bindPressed: Bindable, api: BindCatcherApi): Bindable;
}
