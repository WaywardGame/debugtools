import { EntityType } from "@wayward/game/game/entity/IEntity";
import { Action } from "@wayward/game/game/entity/action/Action";
import { ActionArgument, ActionUsability } from "@wayward/game/game/entity/action/IAction";
import { defaultCanUseHandler } from "../Actions";
import { setDecay } from "./SetDecay";

/**
 * Sets the decay of all items in a human's inventory
 */
export default new Action(ActionArgument.Container, ActionArgument.Float64)
	.setUsableBy(EntityType.Human)
	.setUsableWhen(ActionUsability.Always)
	.setCanUse(defaultCanUseHandler)
	.setHandler((action, target, decay) => setDecay(action, decay, ...target.containedItems));
