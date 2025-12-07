import { EntityType } from "@wayward/game/game/entity/IEntity";
import { Action } from "@wayward/game/game/entity/action/Action";
import { ActionArgument, ActionUsability } from "@wayward/game/game/entity/action/IAction";
import { defaultCanUseHandler } from "../Actions";
import type { IPlayerData } from "../IDebugTools";
import Mod from "@wayward/game/mod/Mod";
import type DebugToolsMod from "../DebugTools";

const DebugTools = Mod.get<DebugToolsMod>();

export default new Action(ActionArgument.Player, ActionArgument.OBJECT_KEY<IPlayerData>(), ActionArgument.Object)
	.setUsableBy(EntityType.Human)
	.setUsableWhen(ActionUsability.Always)
	.setCanUse(defaultCanUseHandler)
	.setHandler((action, player, key, value) => {
		DebugTools?.instance?.setPlayerData(player, key, value);
	})
	.modRegistration("SetPlayerData");
