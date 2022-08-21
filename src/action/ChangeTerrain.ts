import { Action } from "game/entity/action/Action";
import { ActionArgument } from "game/entity/action/IAction";
import { EntityType } from "game/entity/IEntity";
import { TerrainType } from "game/tile/ITerrain";
import { defaultUsability } from "../Actions";
import SetTilled from "./helpers/SetTilled";

export default new Action(ActionArgument.Integer32, ActionArgument.Vector3)
	.setUsableBy(EntityType.Player)
	.setUsableWhen(...defaultUsability)
	.setHandler((action, terrain: TerrainType, position) => {
		if (!position) return;

		action.executor.island.changeTile(terrain, position.x, position.y, position.z, false);
		SetTilled(action.executor.island, position.x, position.y, position.z, false);

		renderers.computeSpritesInViewport();
		action.setUpdateRender();
	});
