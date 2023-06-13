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

import Doodad from "game/doodad/Doodad";
import { Action } from "game/entity/action/Action";
import { ActionArgument, anyOf } from "game/entity/action/IAction";
import { EntityType } from "game/entity/IEntity";
import { defaultUsability } from "../Actions";
import { DebugToolsTranslation, translation } from "../IDebugTools";
import CloneDoodad from "./helpers/CloneDoodad";
import CloneEntity from "./helpers/CloneEntity";
import Tile from "game/tile/Tile";
import { getTile } from "./helpers/GetTile";

/**
 * Clones an entity or doodad to a new location. If given a player, an NPC with the appearance, items, and stats of the player is cloned.
 */
export default new Action(anyOf(ActionArgument.Entity, ActionArgument.Doodad), ActionArgument.Tile)
	.setUsableBy(EntityType.Human)
	.setUsableWhen(...defaultUsability)
	.setHandler((action, toClone, tile: Tile) => {
		const targetTile = getTile(action.executor, tile, () => translation(DebugToolsTranslation.ActionClone)
			.get(toClone.getName()));
		if (!targetTile) {
			return;
		}

		if (toClone instanceof Doodad) {
			CloneDoodad(toClone, targetTile);

		} else {
			CloneEntity(toClone, targetTile);
		}

		renderers.computeSpritesInViewport(targetTile);
		action.setUpdateRender();
	});
