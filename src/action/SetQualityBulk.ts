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

import { Quality } from "@wayward/game/game/IObject";
import { EntityType } from "@wayward/game/game/entity/IEntity";
import { Action } from "@wayward/game/game/entity/action/Action";
import { ActionArgument } from "@wayward/game/game/entity/action/IAction";
import { defaultUsability } from "../Actions";
import { setQuality } from "./SetQuality";

/**
 * Sets the quality of all items in a human's inventory
 */
export default new Action(ActionArgument.Container, ActionArgument.ENUM(Quality))
	.setUsableBy(EntityType.Human)
	.setUsableWhen(...defaultUsability)
	.setHandler((action, target, quality) => setQuality(action, quality, ...target.containedItems));
