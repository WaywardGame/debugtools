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
	.setUsableBy(EntityType.Player)
	.setUsableWhen(...defaultUsability)
	.setHandler((action, toRemove) => {
		if (toRemove instanceof Player) {
			return;
		}

		Remove(action, toRemove as any);

		renderer?.computeSpritesInViewport();
		action.setUpdateRender();
	});
