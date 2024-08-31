import { Action } from "@wayward/game/game/entity/action/Action";
import { ActionArgument } from "@wayward/game/game/entity/action/IAction";
import { AiType } from "@wayward/game/game/entity/ai/AI";
import { EntityType } from "@wayward/game/game/entity/IEntity";
import { defaultCanUseHandler, defaultUsability } from "../Actions";

export default new Action(ActionArgument.Creature, ActionArgument.ENUM(AiType), ActionArgument.Boolean)
	.setUsableBy(EntityType.Human)
	.setUsableWhen(...defaultUsability)
	.setCanUse(defaultCanUseHandler)
	.setHandler((action, creature, ai, present) => {
		creature.ai.toggle(ai, present);
	});
