import type { IActionApi } from "@wayward/game/game/entity/action/IAction";
import type Entity from "@wayward/game/game/entity/Entity";
import type Item from "@wayward/game/game/item/Item";
import InspectDialog from "../../ui/InspectDialog";
import type Human from "@wayward/game/game/entity/Human";

export default function (action: IActionApi<Human>, item: Item): void {
	const container = item.containedWithin;
	action.executor.island.items.remove(item);

	if (container) {
		if ("data" in container) {
			action.setUpdateView(); // we removed the item from a tile

		} else if ("entityType" in container) {
			const entity = container as any as Entity;
			entity.asHuman?.updateTablesAndWeight("M");
		}
	}

	InspectDialog.INSTANCE?.update();
}
