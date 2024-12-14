import { Action } from "@wayward/game/game/entity/action/Action";
import { ActionArgument, ActionUsability } from "@wayward/game/game/entity/action/IAction";
import { EntityType } from "@wayward/game/game/entity/IEntity";
import WorldZ from "@wayward/utilities/game/WorldZ";
import Enums from "@wayward/game/utilities/enum/Enums";
import { defaultCanUseHandler } from "../Actions";

export default new Action(ActionArgument.Integer32)
	.setUsableBy(EntityType.Human)
	.setUsableWhen(ActionUsability.Always)
	.setCanUse(defaultCanUseHandler)
	.setHandler((action, z) => {
		if (!Enums.isValid(WorldZ, z)) {
			return;
		}

		action.executor.setZ(z);
	});
