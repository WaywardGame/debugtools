import { Action } from "@wayward/game/game/entity/action/Action";
import { ActionArgument, ActionUsability } from "@wayward/game/game/entity/action/IAction";
import { EntityType } from "@wayward/game/game/entity/IEntity";
import { defaultCanUseHandler } from "../Actions";
import SetTilled from "./helpers/SetTilled";

export default new Action(ActionArgument.Tile, ActionArgument.Boolean)
	.setUsableBy(EntityType.Human)
	.setUsableWhen(ActionUsability.Always)
	.setCanUse(defaultCanUseHandler)
	.setHandler((action, tile, tilled) => {
		if (!tile) {
			return;
		}

		SetTilled(action.executor.island, tile, tilled);

		renderers.computeSpritesInViewport(tile);
		action.setUpdateRender();
	});
