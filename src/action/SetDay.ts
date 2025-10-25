import { Action } from "@wayward/game/game/entity/action/Action";
import { ActionUsability } from "@wayward/game/game/entity/action/IAction";
import { EntityType } from "@wayward/game/game/entity/IEntity";
import { defaultCanUseHandler } from "../Actions";
import Curse from "@wayward/game/game/curse/Curse";

export default new Action()
	.setUsableBy(EntityType.Human)
	.setUsableWhen(ActionUsability.Always)
	.setCanUse(defaultCanUseHandler)
	.setHandler(action => {
		action.executor.island.game.time.setTime(0);
		action.executor.island.game.time.nextTick();

		// tick curse once for curse ending
		Curse.tickCurse(action.executor.island, action.executor.island.getPlayers(true));

		action.executor.computeLights();
		action.setUpdateView(true);
	});
