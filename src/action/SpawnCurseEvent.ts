import { Action } from "@wayward/game/game/entity/action/Action";
import { ActionArgument, ActionUsability } from "@wayward/game/game/entity/action/IAction";
import { EntityType } from "@wayward/game/game/entity/IEntity";
import { CurseEventType } from "@wayward/game/game/curse/ICurse";
import Curse from "@wayward/game/game/curse/Curse";
import Mod from "@wayward/game/mod/Mod";
import type DebugToolsT from "../DebugTools";
import { defaultCanUseHandler } from "../Actions";

const DebugTools = Mod.get<DebugToolsT>();

export default new Action(ActionArgument.ENUM(CurseEventType))
	.setUsableBy(EntityType.Human)
	.setUsableWhen(ActionUsability.Always)
	.setCanUse(defaultCanUseHandler)
	.setHandler((action, curseType: CurseEventType) => {
		const instance = Curse.attemptSpecificCurseEventSpawnOnPlayer(action.executor, curseType, "full");
		if (instance) {
			DebugTools?.log.info("Spawned curse event", CurseEventType[curseType], instance);
		} else {
			DebugTools?.log.info("Curse event did not spawn");
		}
	});
