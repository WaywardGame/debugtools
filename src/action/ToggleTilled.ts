import { Action } from "entity/action/Action";
import { ActionArgument } from "entity/action/IAction";
import { EntityType } from "entity/IEntity";
import { defaultUsability } from "../Actions";
import SetTilled from "./helpers/SetTilled";

export default new Action(ActionArgument.Vector3, ActionArgument.Boolean)
	.setUsableBy(EntityType.Player)
	.setUsableWhen(...defaultUsability)
	.setHandler((action, position, tilled) => {
		if (!position) return;

		SetTilled(position.x, position.y, position.z, tilled);

		renderer?.computeSpritesInViewport();
		action.setUpdateRender();
	});
