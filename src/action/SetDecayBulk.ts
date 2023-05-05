import { EntityType } from "game/entity/IEntity";
import { Action } from "game/entity/action/Action";
import { ActionArgument } from "game/entity/action/IAction";
import { defaultUsability } from "../Actions";
import { setDecay } from "./SetDecay";

/**
 * Sets the decay of all items in a human's inventory
 */
export default new Action(ActionArgument.Container, ActionArgument.Integer32)
	.setUsableBy(EntityType.Human)
	.setUsableWhen(...defaultUsability)
	.setHandler((action, target, decay) => setDecay(action, decay, ...target.containedItems));
