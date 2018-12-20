import { Action } from "action/Action";
import { ActionArgument } from "action/IAction";
import { EntityType } from "entity/IEntity";
import { ITemplateOptions, spawnTemplate } from "mapgen/MapGenHelpers";
import { TileTemplateType } from "tile/ITerrain";
import { defaultUsability } from "../Actions";

export default new Action(ActionArgument.Number, ActionArgument.Vector2, ActionArgument.Object)
	.setUsableBy(EntityType.Player)
	.setUsableWhen(...defaultUsability)
	.setHandler((action, type: TileTemplateType, point, options: ITemplateOptions) => {
		spawnTemplate(type, point!.x, point!.y, action.executor.z, options);
		action.setUpdateView();
	});
