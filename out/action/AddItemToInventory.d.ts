import { Action } from "game/entity/action/Action";
import { ActionArgument } from "game/entity/action/IAction";
export declare const ADD_ITEM_RANDOM = 1000000001;
export declare const ADD_ITEM_ALL = 1000000002;
declare const _default: Action<[[ActionArgument.Container, ActionArgument.Player], ActionArgument.Integer, ActionArgument.Quality, ActionArgument.Integer], import("../../node_modules/@wayward/types/definitions/game/entity/player/Player").default, void, [import("../../node_modules/@wayward/types/definitions/game/entity/player/Player").default | import("game/item/IItem").IContainer, number, import("../../node_modules/@wayward/types/definitions/game/IObject").Quality, number]>;
export default _default;
