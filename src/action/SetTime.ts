import { Action } from "action/Action";
import { ActionArgument } from "action/IAction";
import { EntityType } from "entity/IEntity";
import { defaultUsability } from "../Actions";

export default new Action(ActionArgument.Number)
	.setUsableBy(EntityType.Player)
	.setUsableWhen(...defaultUsability)
	.setHandler((action, time) => {
		game.time.setTime(time);
		action.setUpdateView(true);
	});
