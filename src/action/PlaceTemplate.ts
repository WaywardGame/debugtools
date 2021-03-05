import { Action } from "game/entity/action/Action";
import { ActionArgument } from "game/entity/action/IAction";
import { EntityType } from "game/entity/IEntity";
import { ITemplateOptions, spawnTemplate } from "game/mapgen/MapGenHelpers";
import { TileTemplateType } from "game/tile/ITerrain";
import { defaultUsability } from "../Actions";

export default new Action(ActionArgument.Number, ActionArgument.Vector2, ActionArgument.Object)
	.setUsableBy(EntityType.Player)
	.setUsableWhen(...defaultUsability)
	.setHandler((action, type: TileTemplateType, point, options: ITemplateOptions) => {
		spawnTemplate(type, point!.x, point!.y, action.executor.z, options);
		action.setUpdateView();
	});
