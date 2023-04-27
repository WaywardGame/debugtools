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
