import { IslandId } from "@wayward/game/game/island/IIsland";
import { Action } from "@wayward/game/game/entity/action/Action";
import { ActionArgument } from "@wayward/game/game/entity/action/IAction";
import { EntityType } from "@wayward/game/game/entity/IEntity";

import { defaultCanUseHandler, defaultUsability } from "../Actions";

export default new Action(ActionArgument.String, ActionArgument.Integer32)
	.setUsableBy(EntityType.Human)
	.setUsableWhen(...defaultUsability)
	.setCanUse(defaultCanUseHandler)
	.setHandler((action, islandId, biome) => {
		action.executor.moveToIslandId(islandId as IslandId, { newIslandOverrides: { biomeType: biome } });
	});
