import { IActionApi } from "action/IAction";
import Entity from "entity/Entity";
import IEntity, { EntityType } from "entity/IEntity";
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
			const entity = container as IEntity;
			if (Entity.is(entity, EntityType.Player)) {
				entity.updateTablesAndWeight();
			}
		}
	}

	if (InspectDialog.INSTANCE) InspectDialog.INSTANCE.update();
}
