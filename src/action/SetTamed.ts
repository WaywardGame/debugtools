import { Action } from "@wayward/game/game/entity/action/Action";
import { ActionArgument } from "@wayward/game/game/entity/action/IAction";
import { EntityType } from "@wayward/game/game/entity/IEntity";
import { defaultCanUseHandler, defaultUsability } from "../Actions";

export default new Action(ActionArgument.Creature, ActionArgument.Boolean)
	.setUsableBy(EntityType.Human)
	.setUsableWhen(...defaultUsability)
	.setCanUse(defaultCanUseHandler)
	.setHandler((action, creature, tamed) => {
		if (tamed) creature!.tame(action.executor, Number.MAX_SAFE_INTEGER);
		else creature!.release();
	});
