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
import Doodad from "game/doodad/Doodad";
import { Action } from "game/entity/action/Action";
import { ActionArgument } from "game/entity/action/IAction";
import Tile from "game/tile/Tile";
declare const _default: Action<[[ActionArgument.Entity, ActionArgument.Doodad], ActionArgument.Tile], import("../../node_modules/@wayward/types/definitions/game/game/entity/Human").default<number>, void, import("game/entity/action/IAction").IActionUsable, [Doodad | import("../../node_modules/@wayward/types/definitions/game/game/entity/Entity").default<unknown, number, unknown, unknown>, Tile]>;
export default _default;
