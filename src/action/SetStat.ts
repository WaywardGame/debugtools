import { Action } from "entity/action/Action";
import { ActionArgument } from "entity/action/IAction";
import { EntityType } from "entity/IEntity";
import { Stat } from "entity/IStats";
import { defaultUsability } from "../Actions";

export default new Action(ActionArgument.Entity, ActionArgument.Number, ActionArgument.Number)
	.setUsableBy(EntityType.Player)
	.setUsableWhen(...defaultUsability)
	.setHandler((action, entity, stat: Stat, value) => {
		entity.stat.set(stat, value);
	});
