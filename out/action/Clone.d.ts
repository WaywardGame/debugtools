import Doodad from "game/doodad/Doodad";
import { Action } from "game/entity/action/Action";
import { ActionArgument } from "game/entity/action/IAction";
import { IVector3 } from "utilities/math/IVector";
declare const _default: Action<[[ActionArgument.Entity, ActionArgument.Doodad], ActionArgument.Vector3], import("@wayward/types/definitions/game/game/entity/player/Player").default, void, [import("@wayward/types/definitions/game/game/entity/Entity").default | Doodad, IVector3]>;
export default _default;
