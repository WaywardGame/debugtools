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
import { ActionArgument, anyOf } from "game/entity/action/IAction";
import { EntityType } from "game/entity/IEntity";
import Player from "game/entity/player/Player";
import { defaultUsability } from "../Actions";
import Remove from "./helpers/Remove";

/**
 * Removes a creature, NPC, item, doodad, corpse, or tile event.
 */
export default new Action(anyOf(ActionArgument.Entity, ActionArgument.Doodad, ActionArgument.Corpse, ActionArgument.TileEvent, ActionArgument.Item))
	.setUsableBy(EntityType.Human)
	.setUsableWhen(...defaultUsability)
	.setHandler((action, toRemove) => {
		if (toRemove instanceof Player) {
			return;
		}

		Remove(action, toRemove as any);

		renderers.computeSpritesInViewport(toRemove);
		action.setUpdateRender();
	});
