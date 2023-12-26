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

import { EntityType } from "@wayward/game/game/entity/IEntity";
import { Action } from "@wayward/game/game/entity/action/Action";
import { ActionArgument } from "@wayward/game/game/entity/action/IAction";
import Translation from "@wayward/game/language/Translation";
import { defaultCanUseHandler, defaultUsability } from "../Actions";

export default new Action(ActionArgument.String)
	.setUsableBy(EntityType.Human)
	.setUsableWhen(...defaultUsability)
	.setCanUse(defaultCanUseHandler)
	.setHandler((action, name) => {
		if (!name || action.executor.island.name === name)
			return;

		action.setContext(undefined, Translation.merge(action.executor.island.getName()), { NEW_NAME: name });
		action.executor.island.name = name === action.executor.island.id ? undefined : name;
	});
