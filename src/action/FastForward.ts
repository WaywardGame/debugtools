import { TickFlag } from "@wayward/game/game/IGame";
import { EntityType } from "@wayward/game/game/entity/IEntity";
import { Action } from "@wayward/game/game/entity/action/Action";
import { ActionArgument } from "@wayward/game/game/entity/action/IAction";
import Actions, { defaultUsability } from "../Actions";

export default new Action(ActionArgument.Integer32, ActionArgument.OPTIONAL(ActionArgument.FLAGS(TickFlag)))
	.setUsableBy(EntityType.Player)
	.setUsableWhen(...defaultUsability)
	.setCanUse(action => {
		if (!Actions.DEBUG_TOOLS.hasPermission(action.executor)) {
			return { usable: false };
		}

		return { usable: true };
	})
	.setHandler((action, ticks, flags) => {
		multiplayer.runSafely(() => action.executor.island.fastForward(ticks, flags), {
			isSynced: true,
			pauseIncomingPacketProcessing: true,
		});
	});
