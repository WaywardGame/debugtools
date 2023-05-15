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

import { Action } from "game/entity/action/Action";
import { ActionArgument } from "game/entity/action/IAction";
import { EntityType } from "game/entity/IEntity";
import MapGenHelpers from "game/mapgen/MapGenHelpers";
import { TileTemplateType } from "game/tile/ITerrain";
import { defaultUsability } from "../Actions";

export default new Action(ActionArgument.Integer32, ActionArgument.Vector2, ActionArgument.Object)
	.setUsableBy(EntityType.Human)
	.setUsableWhen(...defaultUsability)
	.setHandler((action, type: TileTemplateType, point, options: MapGenHelpers.ITemplateOptions) => {
		MapGenHelpers.spawnTemplate(action.executor.island, type, point!.x, point!.y, action.executor.z, options);
		action.setUpdateView(true);
	});
