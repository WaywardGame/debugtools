import { Action } from "game/entity/action/Action";
import { ActionArgument, IActionHandlerApi } from "game/entity/action/IAction";
import Player from "game/entity/player/Player";
import Item from "game/item/Item";
declare const _default: Action<[ActionArgument.Item, ActionArgument.Integer32], Player, void, import("game/entity/action/IAction").IActionUsable, [Item, number]>;
export default _default;
export declare function setDurability(action: IActionHandlerApi<Player>, durability: number, ...items: Item[]): void;
