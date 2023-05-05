import { Action } from "game/entity/action/Action";
import { ActionArgument } from "game/entity/action/IAction";
import Human from "game/entity/Human";
export declare const ADD_ITEM_RANDOM = 1000000001;
export declare const ADD_ITEM_ALL = 1000000002;
declare const _default: Action<[ActionArgument.Container, ActionArgument.Integer32, ActionArgument.Quality, ActionArgument.Integer32], Human<number>, void, import("game/entity/action/IAction").IActionUsable, [import("game/item/IItem").IContainer, number, import("../../node_modules/@wayward/types/definitions/game/game/IObject").Quality, number]>;
export default _default;
