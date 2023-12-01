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
import Human from "@wayward/game/game/entity/Human";
import { Action } from "@wayward/game/game/entity/action/Action";
import { ActionArgument, IActionHandlerApi } from "@wayward/game/game/entity/action/IAction";
import Item from "@wayward/game/game/item/Item";
declare const _default: Action<[ActionArgument.Item, ActionArgument.Float64], Human<number, import("@wayward/game/game/reference/IReferenceManager").ReferenceType.NPC | import("@wayward/game/game/reference/IReferenceManager").ReferenceType.Player>, void, import("@wayward/game/game/entity/action/IAction").IActionUsable, [Item, number]>;
export default _default;
export declare function setDurability(action: IActionHandlerApi<Human>, durability: number, ...items: Item[]): void;
