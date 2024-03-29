/*!
 * Copyright 2011-2023 Unlok
 * https://www.unlok.ca
 *
 * Credits & Thanks:
 * https://www.unlok.ca/credits-thanks/
 *
 * Wayward is a copyrighted and licensed work. Modification and/or distribution of any source files is prohibited. If you wish to modify the game in any way, please refer to the modding guide:
 * https://github.com/WaywardGame/types/wiki
 */

import { EntityType } from "game/entity/IEntity";
import { SkillType } from "game/entity/IHuman";
import { Action } from "game/entity/action/Action";
import { ActionArgument } from "game/entity/action/IAction";
import Enums from "utilities/enum/Enums";
import Actions, { defaultUsability } from "../Actions";
import CloneInventory from "./helpers/CloneInventory";

export default new Action(ActionArgument.Player, ActionArgument.Player)
	.setUsableBy(EntityType.Player)
	.setUsableWhen(...defaultUsability)
	.setConfirmer((action, target, from) => {
		return action.prompt(Actions.DEBUG_TOOLS.prompts.promptReplacePlayerData,
			target.getName(),
			from.getName());
	})
	.setHandler((action, target, from) => {
		for (const skill of Enums.values(SkillType)) {
			target.skill.set(skill, from.skill.getCore(skill));
		}

		CloneInventory(from, target);

		// stats?
	});