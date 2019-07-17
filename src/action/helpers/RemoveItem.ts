import { IActionApi } from "entity/action/IAction";
import Entity from "entity/Entity";
import { EntityType } from "entity/IEntity";
import Player from "entity/player/Player";
import Item from "item/Item";

import InspectDialog from "../../ui/InspectDialog";

export default function (action: IActionApi<Player>, item: Item) {
	const container = item.containedWithin;
	itemManager.remove(item);

	if (container) {
		if ("data" in container) {
			action.setUpdateView(); // we removed the item from a tile

		} else if ("entityType" in container) {
			const entity = container as Entity;
			if (Entity.is(entity, EntityType.Player)) {
				entity.updateTablesAndWeight();
			}
		}
	}

	if (InspectDialog.INSTANCE) InspectDialog.INSTANCE.update();
}
