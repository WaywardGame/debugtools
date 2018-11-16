import { Action } from "action/Action";
import { ActionArgument } from "action/IAction";
import { EntityType } from "entity/IEntity";
import { defaultUsability } from "../Actions";

export default new Action(ActionArgument.Creature, ActionArgument.Boolean)
	.setUsableBy(EntityType.Player)
	.setUsableWhen(...defaultUsability)
	.setHandler((action, creature, tamed) => {
		if (tamed) creature!.tame(action.executor);
		else creature!.release();
	});