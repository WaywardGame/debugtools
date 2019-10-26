import { ActionApi } from "entity/action/IAction";
import Entity from "entity/Entity";
import { IVector3 } from "utilities/math/IVector";
export declare function teleportEntity(action: ActionApi<any>, entity: Entity, position?: IVector3): void;
