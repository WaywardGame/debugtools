import { Action } from "@wayward/game/game/entity/action/Action";
import { ActionArgument, ActionUsability } from "@wayward/game/game/entity/action/IAction";
import { EntityType } from "@wayward/game/game/entity/IEntity";
import { NPCType } from "@wayward/game/game/entity/npc/INPCs";
import { defaultCanUseHandler } from "../Actions";

export default new Action(ActionArgument.ENUM(NPCType))
	.setUsableBy(EntityType.Human)
	.setUsableWhen(ActionUsability.Always)
	.setCanUse(defaultCanUseHandler)
	.setHandler((action, type) => {
		action.executor.island.npcs.resetSpawnInterval(type);
	});
