/*!
 * Copyright 2011-2024 Unlok
 * https://www.unlok.ca
 *
 * Credits & Thanks:
 * https://www.unlok.ca/credits-thanks/
 *
 * Wayward is a copyrighted and licensed work. Modification and/or distribution of any source files is prohibited. If you wish to modify the game in any way, please refer to the modding guide:
 * https://github.com/WaywardGame/types/wiki
 */

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
