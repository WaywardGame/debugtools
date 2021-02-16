import { Action } from "entity/action/Action";
import { ActionArgument } from "entity/action/IAction";
import { EntityType } from "entity/IEntity";
import { SkillType } from "entity/IHuman";
import { defaultUsability } from "../Actions";

export default new Action(ActionArgument.Player, ActionArgument.Number, ActionArgument.Number)
	.setUsableBy(EntityType.Player)
	.setUsableWhen(...defaultUsability)
	.setHandler((action, player, skill: SkillType, value) => {
		if (!player) return;

		player.skill.setCore(skill, value);
	});
