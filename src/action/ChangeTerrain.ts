import { Action } from "@wayward/game/game/entity/action/Action";
import { ActionArgument } from "@wayward/game/game/entity/action/IAction";
import { EntityType } from "@wayward/game/game/entity/IEntity";
import { TerrainType } from "@wayward/game/game/tile/ITerrain";
import { defaultCanUseHandler, defaultUsability } from "../Actions";
import SetTilled from "./helpers/SetTilled";

export default new Action(ActionArgument.Integer32, ActionArgument.Tile)
	.setUsableBy(EntityType.Human)
	.setUsableWhen(...defaultUsability)
	.setCanUse(defaultCanUseHandler)
	.setHandler((action, terrain: TerrainType, tile) => {
		tile.changeTile(terrain, false);
		SetTilled(action.executor.island, tile, false);

		renderers.computeSpritesInViewport(tile);
		action.setUpdateRender();
	});
