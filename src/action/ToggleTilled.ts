import { Action } from "game/entity/action/Action";
import { ActionArgument } from "game/entity/action/IAction";
import { EntityType } from "game/entity/IEntity";
import { defaultUsability } from "../Actions";
import SetTilled from "./helpers/SetTilled";

export default new Action(ActionArgument.Tile, ActionArgument.Boolean)
	.setUsableBy(EntityType.Human)
	.setUsableWhen(...defaultUsability)
	.setHandler((action, tile, tilled) => {
		if (!tile) return;

		SetTilled(action.executor.island, tile, tilled);

		renderers.computeSpritesInViewport(tile);
		action.setUpdateRender();
	});
