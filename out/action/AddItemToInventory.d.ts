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
import { Quality } from "@wayward/game/game/IObject";
import Human from "@wayward/game/game/entity/Human";
import { Action } from "@wayward/game/game/entity/action/Action";
import { ActionArgument } from "@wayward/game/game/entity/action/IAction";
export declare const ADD_ITEM_RANDOM = 1000000001;
export declare const ADD_ITEM_ALL = 1000000002;
declare const _default: Action<[ActionArgument.Container, [ActionArgument.Integer32, ActionArgument.String], import("@wayward/game/game/entity/action/argument/ActionArgumentEnum").default<Quality, "None" | "Random" | "Exceptional" | "Superior" | "Remarkable" | "Mastercrafted" | "Relic">, ActionArgument.Integer32], Human<number, import("@wayward/game/game/reference/IReferenceManager").ReferenceType.NPC | import("@wayward/game/game/reference/IReferenceManager").ReferenceType.Player>, void, import("@wayward/game/game/entity/action/IAction").IActionUsable, [import("@wayward/game/game/item/IItem").IContainer, string | number, Quality, number]>;
export default _default;
