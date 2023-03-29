import { EntityType } from "game/entity/IEntity";
import { Action } from "game/entity/action/Action";
import { ActionArgument } from "game/entity/action/IAction";
import { defaultUsability } from "../Actions";
import { setDurability } from "./SetDurability";

/**
 * Sets the durability of all items in a human's inventory
 */
export default new Action(ActionArgument.Container, ActionArgument.Integer32)
	.setUsableBy(EntityType.Player)
	.setUsableWhen(...defaultUsability)
	.setHandler((action, target, durability) => setDurability(action, durability, ...target.containedItems));
