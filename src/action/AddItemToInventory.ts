import { Action } from "game/entity/action/Action";
import { ActionArgument, anyOf } from "game/entity/action/IAction";
import { EntityType } from "game/entity/IEntity";
import { defaultUsability } from "../Actions";
import InspectDialog from "../ui/InspectDialog";

/**
 * Adds an item to the inventory of a doodad, human, or tile.
 */
export default new Action(anyOf(ActionArgument.Container, ActionArgument.Player), ActionArgument.ItemType, ActionArgument.Quality)
	.setUsableBy(EntityType.Player)
	.setUsableWhen(...defaultUsability)
	.setHandler((action, target, item, quality) => {
		if ("entityType" in target) {
			target.createItemInInventory(item, quality);
			target.updateTablesAndWeight("M");

		} else {
			itemManager.create(item, target, quality);
			action.setUpdateView();
		}

		if (InspectDialog.INSTANCE) InspectDialog.INSTANCE.update();
	});
