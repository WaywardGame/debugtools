import { Action } from "game/entity/action/Action";
import { ActionArgument } from "game/entity/action/IAction";
import { EntityType } from "game/entity/IEntity";
import { defaultUsability } from "../Actions";
import SetTilled from "./helpers/SetTilled";

export default new Action(ActionArgument.Vector3, ActionArgument.Boolean)
	.setUsableBy(EntityType.Player)
	.setUsableWhen(...defaultUsability)
	.setHandler((action, position, tilled) => {
		if (!position) return;

		SetTilled(action.executor.island, position.x, position.y, position.z, tilled);

		renderers.computeSpritesInViewport();
		action.setUpdateRender();
	});
