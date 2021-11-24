import { Action } from "game/entity/action/Action";
import { ActionArgument } from "game/entity/action/IAction";
import { EntityType } from "game/entity/IEntity";
import { Stat } from "game/entity/IStats";
import { defaultUsability } from "../Actions";

export default new Action(ActionArgument.Entity, ActionArgument.Integer32, ActionArgument.Float64)
	.setUsableBy(EntityType.Player)
	.setUsableWhen(...defaultUsability)
	.setHandler((action, entity, stat: Stat, value) => {
		entity.stat.set(stat, value);
	});
