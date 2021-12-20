import { Action } from "game/entity/action/Action";
import { ActionArgument } from "game/entity/action/IAction";
import { EntityType } from "game/entity/IEntity";
import { WorldZ } from "game/WorldZ";
import Enums from "utilities/enum/Enums";
import { defaultUsability } from "../Actions";

export default new Action(ActionArgument.Integer32)
	.setUsableBy(EntityType.Player)
	.setUsableWhen(...defaultUsability)
	.setHandler((action, z) => {
		if (!Enums.isValid(WorldZ, z))
			return;

		action.executor.setZ(z);
	});
