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
import { AiMaskType } from "@wayward/game/game/entity/ai/AI";
import { EntityType } from "@wayward/game/game/entity/IEntity";
import { defaultCanUseHandler, defaultUsability } from "../Actions";

export default new Action(ActionArgument.Creature, ActionArgument.ENUM(AiMaskType), ActionArgument.Boolean)
	.setUsableBy(EntityType.Human)
	.setUsableWhen(...defaultUsability)
	.setCanUse(defaultCanUseHandler)
	.setHandler((action, creature, ai, present) => {
		creature.ai.toggleMask(ai, present);
	});
