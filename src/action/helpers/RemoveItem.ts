import { IActionApi } from "game/entity/action/IAction";
import Entity from "game/entity/Entity";
import Player from "game/entity/player/Player";
import Item from "game/item/Item";
import InspectDialog from "../../ui/InspectDialog";

export default function (action: IActionApi<Player>, item: Item) {
	const container = item.containedWithin;
	itemManager.remove(item);

	if (container) {
		if ("data" in container) {
			action.setUpdateView(); // we removed the item from a tile

		} else if ("entityType" in container) {
			const entity = container as Entity;
			entity.asPlayer?.updateTablesAndWeight("M");
		}
	}

	if (InspectDialog.INSTANCE) InspectDialog.INSTANCE.update();
}
