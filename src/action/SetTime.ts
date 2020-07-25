import { Action } from "entity/action/Action";
import { ActionArgument } from "entity/action/IAction";
import { EntityType } from "entity/IEntity";

import { defaultUsability } from "../Actions";

export default new Action(ActionArgument.Number)
	.setUsableBy(EntityType.Player)
	.setUsableWhen(...defaultUsability)
	.setHandler((action, time) => {
		island.time.setTime(time);
		action.setUpdateView(true);
	});
