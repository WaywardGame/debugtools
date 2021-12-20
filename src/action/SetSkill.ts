import { Action } from "game/entity/action/Action";
import { ActionArgument } from "game/entity/action/IAction";
import { EntityType } from "game/entity/IEntity";
import { SkillType } from "game/entity/IHuman";
import { defaultUsability } from "../Actions";

export default new Action(ActionArgument.Player, ActionArgument.Integer32, ActionArgument.Float64)
	.setUsableBy(EntityType.Player)
	.setUsableWhen(...defaultUsability)
	.setHandler((action, player, skill: SkillType, value) => {
		if (!player) return;

		player.skill.setCore(skill, value);
	});
