import Curse from "@wayward/game/game/curse/Curse";
import { Action } from "@wayward/game/game/entity/action/Action";
import { ActionArgument, ActionUsability } from "@wayward/game/game/entity/action/IAction";
import { EntityType } from "@wayward/game/game/entity/IEntity";
import { defaultCanUseHandler } from "../Actions";

export default new Action(ActionArgument.Integer32, ActionArgument.Array)
	.setUsableBy(EntityType.Human)
	.setUsableWhen(ActionUsability.Always)
	.setCanUse(defaultCanUseHandler)
	.setHandler((action, eventIndex: number, path: Array<string | number>) => {
		const event = action.executor.island.curse.events?.[eventIndex];
		if (!event) {
			return;
		}

		Curse.restartScriptBranch(event, path);
	})
	.modRegistration("RestartCurseEventScriptBranch");