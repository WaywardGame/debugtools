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

import { Action } from "game/entity/action/Action";
import { ActionArgument } from "game/entity/action/IAction";
import { EntityType } from "game/entity/IEntity";
import { defaultUsability } from "../Actions";
import { teleportEntity } from "./helpers/TeleportEntity";

/**
 * Teleports an entity to a position.
 */
export default new Action(ActionArgument.Entity, ActionArgument.Tile)
	.setUsableBy(EntityType.Human)
	.setUsableWhen(...defaultUsability)
	.setHandler(teleportEntity);
