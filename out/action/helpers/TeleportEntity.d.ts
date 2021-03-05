import { ActionApi } from "game/entity/action/IAction";
import Entity from "game/entity/Entity";
import { IVector3 } from "utilities/math/IVector";
export declare function teleportEntity(action: ActionApi<any>, entity: Entity, position?: IVector3): void;
