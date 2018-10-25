import { IActionApi } from "action/IAction";
import IBaseEntity from "entity/IBaseEntity";
import { EntityType } from "entity/IEntity";
import { IItem } from "item/IItem";
import IPlayer from "player/IPlayer";
import InspectDialog from "../../ui/InspectDialog";

export default function (action: IActionApi<IPlayer>, item: IItem) {
	const container = item!.containedWithin;
	itemManager.remove(item!);

	if (container) {
		if ("data" in container) {
			action.setUpdateView(); // we removed the item from a tile

		} else if ("entityType" in container) {
			const entity = container as IBaseEntity;
			if (entity.entityType === EntityType.Player) {
				(entity as IPlayer).updateTablesAndWeight();
			}
		}
	}

	if (InspectDialog.INSTANCE) InspectDialog.INSTANCE.update();
}
