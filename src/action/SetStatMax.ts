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

import { Action } from "@wayward/game/game/entity/action/Action";
import { ActionArgument } from "@wayward/game/game/entity/action/IAction";
import { EntityType } from "@wayward/game/game/entity/IEntity";
import { Stat } from "@wayward/game/game/entity/IStats";
import { ScreenId } from "@wayward/game/ui/screen/IScreen";
import { defaultCanUseHandler, defaultUsability } from "../Actions";

export default new Action(ActionArgument.Entity, ActionArgument.Integer32, ActionArgument.Float64)
	.setUsableBy(EntityType.Human)
	.setUsableWhen(...defaultUsability)
	.setCanUse(defaultCanUseHandler)
	.setHandler((action, entity, stat: Stat, value) => {
		entity?.asEntityWithStats?.stat.setMax(stat, value);
		if (entity.asLocalPlayer && stat === Stat.Health) {
			entity?.asEntityWithStats?.stat.setValue(Stat.Strength, value); // Health is handled via strength, so we need to update its value too
			ui.screens.get(ScreenId.Game)?.["refreshHealthBasedEffects"]();
		}
	});
