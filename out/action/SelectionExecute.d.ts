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
import { Action } from "game/entity/action/Action";
import { ActionArgument } from "game/entity/action/IAction";
declare const _default: Action<[ActionArgument.Integer32, ActionArgument.Array, [ActionArgument.Undefined, ActionArgument.String]], import("../../node_modules/@wayward/types/definitions/game/game/entity/Human").default<number>, void, import("game/entity/action/IAction").IActionUsable, [number, any[], (string | undefined)?]>;
export default _default;
export declare enum SelectionType {
    Creature = 0,
    NPC = 1,
    TileEvent = 2,
    Doodad = 3,
    Corpse = 4,
    Player = 5,
    Location = 6
}
