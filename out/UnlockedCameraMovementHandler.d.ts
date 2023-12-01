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
import Bindable from "@wayward/game/ui/input/Bindable";
import Vector2 from "@wayward/game/utilities/math/Vector2";
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
