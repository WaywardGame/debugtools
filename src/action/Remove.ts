import { EntityType } from "@wayward/game/game/entity/IEntity";
import { Action } from "@wayward/game/game/entity/action/Action";
import { ActionArgument } from "@wayward/game/game/entity/action/IAction";
import Player from "@wayward/game/game/entity/player/Player";
import { defaultCanUseHandler, defaultUsability } from "../Actions";
import Remove from "./helpers/Remove";

/**
 * Removes a creature, NPC, item, doodad, corpse, or tile event.
 */
export default new Action(ActionArgument.ANY(ActionArgument.Entity, ActionArgument.Doodad, ActionArgument.Corpse, ActionArgument.TileEvent, ActionArgument.Item))
	.setUsableBy(EntityType.Human)
	.setUsableWhen(...defaultUsability)
	.setCanUse(defaultCanUseHandler)
	.setHandler((action, toRemove) => {
		if (toRemove instanceof Player) {
			return;
		}

		Remove(action, toRemove as any);

		renderers.computeSpritesInViewport(toRemove);
		action.setUpdateRender();
	});
