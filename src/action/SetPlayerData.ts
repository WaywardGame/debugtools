import { EntityType } from "@wayward/game/game/entity/IEntity";
import { Action } from "@wayward/game/game/entity/action/Action";
import { ActionArgument, ActionUsability } from "@wayward/game/game/entity/action/IAction";
import Actions, { defaultCanUseHandler } from "../Actions";
import type { IPlayerData } from "../IDebugTools";

export default new Action(ActionArgument.Player, ActionArgument.OBJECT_KEY<IPlayerData>(), ActionArgument.Object)
	.setUsableBy(EntityType.Human)
	.setUsableWhen(ActionUsability.Always)
	.setCanUse(defaultCanUseHandler)
	.setHandler((action, player, key, value) => {
		Actions.DEBUG_TOOLS.setPlayerData(player, key, value);
	});
