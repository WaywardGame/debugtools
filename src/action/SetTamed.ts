import { Action } from "@wayward/game/game/entity/action/Action";
import { ActionArgument, ActionUsability } from "@wayward/game/game/entity/action/IAction";
import { EntityType } from "@wayward/game/game/entity/IEntity";
import { defaultCanUseHandler } from "../Actions";

export default new Action(ActionArgument.Creature, ActionArgument.Boolean)
	.setUsableBy(EntityType.Human)
	.setUsableWhen(ActionUsability.Always)
	.setCanUse(defaultCanUseHandler)
	.setHandler((action, creature, tamed) => {
		if (tamed) {
			creature!.tame(action.executor, Number.MAX_SAFE_INTEGER);
		} else {
			creature!.release();
		}
	});
