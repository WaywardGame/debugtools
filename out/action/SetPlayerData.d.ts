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
import { Action } from "@wayward/game/game/entity/action/Action";
import { ActionArgument } from "@wayward/game/game/entity/action/IAction";
import { IPlayerData } from "../IDebugTools";
declare const _default: Action<[ActionArgument.Player, import("@wayward/game/game/entity/action/argument/ActionArgumentObjectKey").default<IPlayerData>, ActionArgument.Object], import("@wayward/game/game/entity/Human").default<number, import("@wayward/game/game/reference/IReferenceManager").ReferenceType.NPC | import("@wayward/game/game/reference/IReferenceManager").ReferenceType.Player>, void, import("@wayward/game/game/entity/action/IAction").IActionUsable, [import("@wayward/game/game/entity/player/Player").default, keyof IPlayerData, any?]>;
export default _default;
