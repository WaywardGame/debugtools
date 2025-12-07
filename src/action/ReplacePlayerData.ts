import { EntityType } from "@wayward/game/game/entity/IEntity";
import { SkillType } from "@wayward/game/game/entity/skill/ISkills";
import { Action } from "@wayward/game/game/entity/action/Action";
import { ActionArgument, ActionUsability } from "@wayward/game/game/entity/action/IAction";
import Enums from "@wayward/game/utilities/enum/Enums";
import { defaultCanUseHandler } from "../Actions";
import CloneInventory from "./helpers/CloneInventory";
import { PromptReplacePlayerData } from "../ui/DebugToolsPrompts";

export default new Action(ActionArgument.Player, ActionArgument.Player)
	.setUsableBy(EntityType.Player)
	.setUsableWhen(ActionUsability.Always)
	.setCanUse(defaultCanUseHandler)
	.setConfirmer((action, target, from) => {
		return action.prompt(PromptReplacePlayerData.value,
			target.getName(),
			from.getName());
	})
	.setHandler((action, target, from) => {
		for (const skill of Enums.values(SkillType)) {
			target.skill.set(skill, from.skill.getCore(skill));
		}

		CloneInventory(from, target);

		// stats?
	})
	.modRegistration("ReplacePlayerData");
