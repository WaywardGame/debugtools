import Doodad from "game/doodad/Doodad";
import { Action } from "game/entity/action/Action";
import { ActionArgument } from "game/entity/action/IAction";
import Tile from "game/tile/Tile";
declare const _default: Action<[[ActionArgument.Entity, ActionArgument.Doodad], ActionArgument.Tile], import("../../node_modules/@wayward/types/definitions/game/game/entity/player/Player").default, void, import("game/entity/action/IAction").IActionUsable, [import("../../node_modules/@wayward/types/definitions/game/game/entity/Entity").default<unknown, number, unknown, unknown> | Doodad, Tile]>;
export default _default;
