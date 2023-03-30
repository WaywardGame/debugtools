import { Action } from "game/entity/action/Action";
import { ActionArgument, IActionHandlerApi } from "game/entity/action/IAction";
import Player from "game/entity/player/Player";
import Item from "game/item/Item";
declare const _default: Action<[ActionArgument.Item, ActionArgument.Float64], Player, void, import("game/entity/action/IAction").IActionUsable, [Item, number]>;
export default _default;
export declare function setDecay(action: IActionHandlerApi<Player>, decay: number, ...items: Item[]): void;
