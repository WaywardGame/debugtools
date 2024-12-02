import { Action } from "@wayward/game/game/entity/action/Action";
import { ActionArgument, ActionUsability } from "@wayward/game/game/entity/action/IAction";
import { AiMaskType } from "@wayward/game/game/entity/ai/AI";
import { EntityType } from "@wayward/game/game/entity/IEntity";
import { defaultCanUseHandler } from "../Actions";

export default new Action(ActionArgument.Creature, ActionArgument.ENUM(AiMaskType), ActionArgument.Boolean)
	.setUsableBy(EntityType.Human)
	.setUsableWhen(ActionUsability.Always)
	.setCanUse(defaultCanUseHandler)
	.setHandler((action, creature, ai, present) => {
		creature.ai.toggleMask(ai, present);
	});
