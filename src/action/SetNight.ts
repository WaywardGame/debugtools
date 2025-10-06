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
		action.executor.island.game.time.setTime(action.executor.island.game.time.dayPercent);
		action.executor.island.game.time.nextTick();
		Curse.clearCooldown(action.executor.island);

		for (let i = 0; i < 2; i++) {
			// tick curse once for "something strange may happen tonight" and once for event start
			Curse.tickCurse(action.executor.island, action.executor.island.getPlayers(true));
		}

		action.executor.computeLights();
		action.setUpdateView(true);
	});
