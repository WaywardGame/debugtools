import { Action } from "game/entity/action/Action";
import { ActionArgument, anyOf } from "game/entity/action/IAction";
import { EntityType } from "game/entity/IEntity";
import { defaultUsability } from "../Actions";
import InspectDialog from "../ui/InspectDialog";

/**
 * Adds an item to the inventory of a doodad, human, or tile.
 */
export default new Action(anyOf(ActionArgument.Container, ActionArgument.Human))
	.setUsableBy(EntityType.Player)
	.setUsableWhen(...defaultUsability)
	.setHandler((action, target) => {
		const inventory = "entityType" in target ? target.inventory : target;
		action.executor.island.items.removeContainerItems(inventory, true);

		if ("entityType" in target) {
			target.asPlayer?.updateTablesAndWeight("M");

		} else {
			action.setUpdateView();
		}

		InspectDialog.INSTANCE?.update();
	});
