import { Action } from "@wayward/game/game/entity/action/Action";
import { ActionArgument } from "@wayward/game/game/entity/action/IAction";
import { EntityType } from "@wayward/game/game/entity/IEntity";
import MapGenHelpers from "@wayward/game/game/mapgen/MapGenHelpers";
import { TileTemplateType } from "@wayward/game/game/tile/ITerrain";
import { defaultCanUseHandler, defaultUsability } from "../Actions";

export default new Action(ActionArgument.Integer32, ActionArgument.Vector2, ActionArgument.Object)
	.setUsableBy(EntityType.Human)
	.setUsableWhen(...defaultUsability)
	.setCanUse(defaultCanUseHandler)
	.setHandler((action, type: TileTemplateType, point, options: MapGenHelpers.ITemplateOptions) => {
		MapGenHelpers.spawnTemplate(action.executor.island, type, point!.x, point!.y, action.executor.z, options);
		action.setUpdateView(true);
	});
