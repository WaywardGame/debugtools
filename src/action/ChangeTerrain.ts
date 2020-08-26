import { Action } from "entity/action/Action";
import { ActionArgument } from "entity/action/IAction";
import { EntityType } from "entity/IEntity";
import { TerrainType } from "tile/ITerrain";
import { defaultUsability } from "../Actions";
import SetTilled from "./helpers/SetTilled";

export default new Action(ActionArgument.Number, ActionArgument.Vector3)
	.setUsableBy(EntityType.Player)
	.setUsableWhen(...defaultUsability)
	.setHandler((action, terrain: TerrainType, position) => {
		if (!position) return;

		game.changeTile(terrain, position.x, position.y, position.z, false);
		SetTilled(position.x, position.y, position.z, false);

		renderer?.computeSpritesInViewport();
		action.setUpdateRender();
	});
