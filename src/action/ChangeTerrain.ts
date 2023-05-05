import { Action } from "game/entity/action/Action";
import { ActionArgument } from "game/entity/action/IAction";
import { EntityType } from "game/entity/IEntity";
import { TerrainType } from "game/tile/ITerrain";
import { defaultUsability } from "../Actions";
import SetTilled from "./helpers/SetTilled";

export default new Action(ActionArgument.Integer32, ActionArgument.Tile)
	.setUsableBy(EntityType.Human)
	.setUsableWhen(...defaultUsability)
	.setHandler((action, terrain: TerrainType, tile) => {
		tile.changeTile(terrain, false);
		SetTilled(action.executor.island, tile, false);

		renderers.computeSpritesInViewport(tile);
		action.setUpdateRender();
	});
