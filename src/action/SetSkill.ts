import { Action } from "@wayward/game/game/entity/action/Action";
import { ActionArgument, ActionUsability } from "@wayward/game/game/entity/action/IAction";
import { EntityType } from "@wayward/game/game/entity/IEntity";
import { SkillType } from "@wayward/game/game/entity/skill/ISkills";
import Enums from "@wayward/game/utilities/enum/Enums";
import { defaultCanUseHandler } from "../Actions";

export default new Action(ActionArgument.Player, ActionArgument.Integer32, ActionArgument.Float64)
	.setUsableBy(EntityType.Human)
	.setUsableWhen(ActionUsability.Always)
	.setCanUse(defaultCanUseHandler)
	.setHandler((action, player, skill: SkillType, value) => {
		if (!player) {
			return;
		}

		if (skill as number !== -1) {
			player.skill.setCore(skill, value);
		} else {
			for (const skill of Enums.values(SkillType)) {
				if (skill) {
					player.skill.setCore(skill, value);
				}
			}
		}
	});
