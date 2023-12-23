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

import { Deity } from "@wayward/game/game/deity/Deity";
import { EntityType } from "@wayward/game/game/entity/IEntity";
import { Action } from "@wayward/game/game/entity/action/Action";
import { ActionArgument } from "@wayward/game/game/entity/action/IAction";
import { defaultCanUseHandler, defaultUsability } from "../Actions";

export default new Action(ActionArgument.Entity, ActionArgument.Integer32, ActionArgument.Integer32)
	.setUsableBy(EntityType.Human)
	.setUsableWhen(...defaultUsability)
	.setCanUse(defaultCanUseHandler)
	.setHandler((action, entity, deity: Deity, value) => {
		entity?.asHuman?.alignment[deity === Deity.Good ? "setGood" : "setEvil"](value);
	});
