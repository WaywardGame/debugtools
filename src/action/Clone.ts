import Doodad from "@wayward/game/game/doodad/Doodad";
import { EntityType } from "@wayward/game/game/entity/IEntity";
import { Action } from "@wayward/game/game/entity/action/Action";
import { ActionArgument, ActionUsability } from "@wayward/game/game/entity/action/IAction";
import type Tile from "@wayward/game/game/tile/Tile";
import { defaultCanUseHandler } from "../Actions";
import { DebugToolsTranslation, translation } from "../IDebugTools";
import CloneDoodad from "./helpers/CloneDoodad";
import CloneEntity from "./helpers/CloneEntity";
import { getTile } from "./helpers/GetTile";

/**
 * Clones an entity or doodad to a new location. If given a player, an NPC with the appearance, items, and stats of the player is cloned.
 */
export default new Action(ActionArgument.ANY(ActionArgument.Entity, ActionArgument.Doodad), ActionArgument.Tile)
	.setUsableBy(EntityType.Human)
	.setUsableWhen(ActionUsability.Always)
	.setCanUse(defaultCanUseHandler)
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
