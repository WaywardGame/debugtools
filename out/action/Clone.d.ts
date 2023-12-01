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
import Doodad from "@wayward/game/game/doodad/Doodad";
import { Action } from "@wayward/game/game/entity/action/Action";
import { ActionArgument } from "@wayward/game/game/entity/action/IAction";
import Tile from "@wayward/game/game/tile/Tile";
declare const _default: Action<[[ActionArgument.Entity, ActionArgument.Doodad], ActionArgument.Tile], import("@wayward/game/game/entity/Human").default<number, import("@wayward/game/game/reference/IReferenceManager").ReferenceType.NPC | import("@wayward/game/game/reference/IReferenceManager").ReferenceType.Player>, void, import("@wayward/game/game/entity/action/IAction").IActionUsable, [Doodad | import("@wayward/game/game/entity/Entity").default<unknown, number, import("@wayward/game/game/reference/IReferenceManager").EntityReferenceTypes, unknown>, Tile]>;
export default _default;
