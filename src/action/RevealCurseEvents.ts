import Curse from "@wayward/game/game/curse/Curse";
import { Action } from "@wayward/game/game/entity/action/Action";
import { ActionUsability } from "@wayward/game/game/entity/action/IAction";
import { EntityType } from "@wayward/game/game/entity/IEntity";
import { defaultCanUseHandler } from "../Actions";

export default new Action()
	.setUsableBy(EntityType.Human)
	.setUsableWhen(ActionUsability.Always)
	.setCanUse(defaultCanUseHandler)
	.setHandler(action => {
		for (const curse of Curse.all(action.executor.island)) {
			curse.reveal(action.executor);
		}
	});
