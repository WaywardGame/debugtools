import { Action } from "action/Action";
import { ActionArgument } from "action/IAction";
import { EntityType } from "entity/IEntity";
import { Stat } from "entity/IStats";
import { defaultUsability } from "../Actions";

export default new Action(ActionArgument.Entity, ActionArgument.Number, ActionArgument.Number)
	.setUsableBy(EntityType.Player)
	.setUsableWhen(...defaultUsability)
	.setHandler((action, entity, stat: Stat, value) => {
		entity.setStat(stat, value);
	});
