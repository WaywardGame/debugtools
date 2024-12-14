import { Action } from "@wayward/game/game/entity/action/Action";
import { ActionArgument, ActionUsability } from "@wayward/game/game/entity/action/IAction";
import { EntityType } from "@wayward/game/game/entity/IEntity";
import type { TerrainType } from "@wayward/game/game/tile/ITerrain";
import { defaultCanUseHandler } from "../Actions";
import SetTilled from "./helpers/SetTilled";

export default new Action(ActionArgument.Integer32, ActionArgument.Tile)
	.setUsableBy(EntityType.Human)
	.setUsableWhen(ActionUsability.Always)
	.setCanUse(defaultCanUseHandler)
	.setHandler((action, terrain: TerrainType, tile) => {
		tile.changeTile(terrain, false);
		SetTilled(action.executor.island, tile, false);

		renderers.computeSpritesInViewport(tile);
		action.setUpdateRender();
	});
