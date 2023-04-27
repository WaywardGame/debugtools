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
    Player = 5
}
