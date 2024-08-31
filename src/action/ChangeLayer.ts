import { Action } from "@wayward/game/game/entity/action/Action";
import { ActionArgument } from "@wayward/game/game/entity/action/IAction";
import { EntityType } from "@wayward/game/game/entity/IEntity";
import { WorldZ } from "@wayward/utilities/game/WorldZ";
import Enums from "@wayward/game/utilities/enum/Enums";
import { defaultCanUseHandler, defaultUsability } from "../Actions";

export default new Action(ActionArgument.Integer32)
	.setUsableBy(EntityType.Human)
	.setUsableWhen(...defaultUsability)
	.setCanUse(defaultCanUseHandler)
	.setHandler((action, z) => {
		if (!Enums.isValid(WorldZ, z))
			return;

		action.executor.setZ(z);
	});
