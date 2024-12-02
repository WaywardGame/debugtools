import type { IslandId } from "@wayward/game/game/island/IIsland";
import { Action } from "@wayward/game/game/entity/action/Action";
import { ActionArgument, ActionUsability } from "@wayward/game/game/entity/action/IAction";
import { EntityType } from "@wayward/game/game/entity/IEntity";

import { defaultCanUseHandler } from "../Actions";

export default new Action(ActionArgument.String, ActionArgument.Integer32)
	.setUsableBy(EntityType.Human)
	.setUsableWhen(ActionUsability.Always)
	.setCanUse(defaultCanUseHandler)
	.setHandler((action, islandId, biome) => {
		void action.executor.moveToIslandId(islandId as IslandId, { newIslandOverrides: { biomeType: biome } });
	});
