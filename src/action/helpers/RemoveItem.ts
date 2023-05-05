import { IActionApi } from "game/entity/action/IAction";
import Entity from "game/entity/Entity";
import Item from "game/item/Item";
import InspectDialog from "../../ui/InspectDialog";
import Human from "game/entity/Human";

export default function (action: IActionApi<Human>, item: Item) {
	const container = item.containedWithin;
	action.executor.island.items.remove(item);

	if (container) {
		if ("data" in container) {
			action.setUpdateView(); // we removed the item from a tile

		} else if ("entityType" in container) {
			const entity = container as any as Entity;
			entity.asPlayer?.updateTablesAndWeight("M");
		}
	}

	InspectDialog.INSTANCE?.update();
}
