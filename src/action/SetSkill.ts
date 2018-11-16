import { Action } from "action/Action";
import { ActionArgument } from "action/IAction";
import { EntityType } from "entity/IEntity";
import { SkillType } from "Enums";
import { defaultUsability } from "../Actions";

export default new Action(ActionArgument.Player, ActionArgument.Number, ActionArgument.Number)
	.setUsableBy(EntityType.Player)
	.setUsableWhen(...defaultUsability)
	.setHandler((action, player, skill: SkillType, value) => {
		if (!player) return;

		player.setSkillCore(skill, value);
	});