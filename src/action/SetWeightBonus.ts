import { Action } from "action/Action";
import { ActionArgument } from "action/IAction";
import { EntityType } from "entity/IEntity";
import { Stat } from "entity/IStats";
import { defaultUsability } from "../Actions";

export default new Action(ActionArgument.Player, ActionArgument.Number)
	.setUsableBy(EntityType.Player)
	.setUsableWhen(...defaultUsability)
	.setHandler((action, player, weightBonus) => {
		player.setStatBonus(Stat.Strength, weightBonus);
	});
