import { Action } from "entity/action/Action";
import { ActionArgument } from "entity/action/IAction";
import { EntityType } from "entity/IEntity";
import { defaultUsability } from "../Actions";

export default new Action(ActionArgument.Doodad, ActionArgument.Number)
	.setUsableBy(EntityType.Player)
	.setUsableWhen(...defaultUsability)
	.setHandler((action, doodad, growingStage) => {
		if (!doodad) return;

		doodad.setGrowingStage(growingStage, true);
		action.setUpdateView();
	});
