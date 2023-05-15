/*!
 * Copyright 2011-2023 Unlok
 * https://www.unlok.ca
 *
 * Credits & Thanks:
 * https://www.unlok.ca/credits-thanks/
 *
 * Wayward is a copyrighted and licensed work. Modification and/or distribution of any source files is prohibited. If you wish to modify the game in any way, please refer to the modding guide:
 * https://github.com/WaywardGame/types/wiki
 */

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
