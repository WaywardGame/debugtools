import { Action } from "game/entity/action/Action";
import { ActionArgument } from "game/entity/action/IAction";
import { EntityType } from "game/entity/IEntity";
import { defaultUsability } from "../Actions";


export default new Action(ActionArgument.Float64)
	.setUsableBy(EntityType.Player)
	.setUsableWhen(...defaultUsability)
	.setHandler((action, time) => {
		action.executor.island.time.setTime(time);
		action.setUpdateView(true);
	});
