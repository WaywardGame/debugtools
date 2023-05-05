import { IslandId } from "game/island/IIsland";
import { Action } from "game/entity/action/Action";
import { ActionArgument } from "game/entity/action/IAction";
import { EntityType } from "game/entity/IEntity";

import { defaultUsability } from "../Actions";

export default new Action(ActionArgument.String, ActionArgument.Integer32)
    .setUsableBy(EntityType.Human)
    .setUsableWhen(...defaultUsability)
    .setHandler((action, islandId, biome) => {
        action.executor.moveToIslandId(islandId as IslandId, { newIslandOverrides: { biomeType: biome } });
    });
