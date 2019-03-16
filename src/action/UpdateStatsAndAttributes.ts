import { Action } from "entity/action/Action";
import { ActionArgument } from "entity/action/IAction";
import { EntityType } from "entity/IEntity";
import { defaultUsability } from "../Actions";

export default new Action(ActionArgument.Player)
	.setUsableBy(EntityType.Player)
	.setUsableWhen(...defaultUsability)
	.setHandler((action, player) => {
		player.updateStatsAndAttributes();
	});
