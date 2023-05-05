import Human from "game/entity/Human";
import { Action } from "game/entity/action/Action";
import { ActionArgument, IActionHandlerApi } from "game/entity/action/IAction";
import Item from "game/item/Item";
declare const _default: Action<[ActionArgument.Item, ActionArgument.Float64], Human<number>, void, import("game/entity/action/IAction").IActionUsable, [Item, number]>;
export default _default;
export declare function setDecay(action: IActionHandlerApi<Human>, decay: number, ...items: Item[]): void;
