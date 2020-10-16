import { Action } from "entity/action/Action";
import { ActionArgument } from "entity/action/IAction";
import Player from "entity/player/Player";
declare const _default: Action<[ActionArgument.Number, ActionArgument.Array, [ActionArgument.Undefined, ActionArgument.String]], Player, void, [number, any[], (string | undefined)?]>;
export default _default;
export declare enum SelectionType {
    Creature = 0,
    NPC = 1,
    TileEvent = 2,
    Doodad = 3,
    Corpse = 4,
    Player = 5
}
