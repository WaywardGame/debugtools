/*!
 * Copyright 2011-2024 Unlok
 * https://www.unlok.ca
 *
 * Credits & Thanks:
 * https://www.unlok.ca/credits-thanks/
 *
 * Wayward is a copyrighted and licensed work. Modification and/or distribution of any source files is prohibited. If you wish to modify the game in any way, please refer to the modding guide:
 * https://github.com/WaywardGame/types/wiki
 */

import { Action } from "@wayward/game/game/entity/action/Action";
import { ActionArgument } from "@wayward/game/game/entity/action/IAction";
import { EntityType } from "@wayward/game/game/entity/IEntity";
import { SkillType } from "@wayward/game/game/entity/IHuman";
import Enums from "@wayward/game/utilities/enum/Enums";
import { defaultCanUseHandler, defaultUsability } from "../Actions";

export default new Action(ActionArgument.Player, ActionArgument.Integer32, ActionArgument.Float64)
	.setUsableBy(EntityType.Human)
	.setUsableWhen(...defaultUsability)
	.setCanUse(defaultCanUseHandler)
	.setHandler((action, player, skill: SkillType, value) => {
		if (!player) return;

		if (skill as number !== -1)
			player.skill.setCore(skill, value);

		else
			for (const skill of Enums.values(SkillType))
				if (skill)
					player.skill.setCore(skill, value);
	});
