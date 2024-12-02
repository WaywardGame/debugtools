import { Action } from "@wayward/game/game/entity/action/Action";
import { ActionArgument, ActionUsability } from "@wayward/game/game/entity/action/IAction";
import { EntityType } from "@wayward/game/game/entity/IEntity";
import { defaultCanUseHandler } from "../Actions";

export default new Action(ActionArgument.Doodad, ActionArgument.Integer32)
	.setUsableBy(EntityType.Human)
	.setUsableWhen(ActionUsability.Always)
	.setCanUse(defaultCanUseHandler)
	.setHandler((action, doodad, growingStage) => {
		if (!doodad) {
			return;
		}

		doodad.setGrowingStage(growingStage);
		action.setUpdateView(true);
	});
