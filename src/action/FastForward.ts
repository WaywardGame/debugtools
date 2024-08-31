import { TickFlag } from "@wayward/game/game/IGame";
import { EntityType } from "@wayward/game/game/entity/IEntity";
import { Action } from "@wayward/game/game/entity/action/Action";
import { ActionArgument } from "@wayward/game/game/entity/action/IAction";
import { defaultCanUseHandler, defaultUsability } from "../Actions";

export default new Action(ActionArgument.Integer32, ActionArgument.OPTIONAL(ActionArgument.ENUM(TickFlag)))
	.setUsableBy(EntityType.Player)
	.setUsableWhen(...defaultUsability)
	.setCanUse(defaultCanUseHandler)
	.setHandler((action, ticks, tickFlags) => {
		multiplayer.runSafely(
			() =>
				action.executor.island.fastForward({
					ticks,
					tickFlags,
					playingHumans: action.executor.island.getPlayers(true),
				}),
			{
				isSynced: true,
				pauseIncomingPacketProcessing: true,
			});
	});
