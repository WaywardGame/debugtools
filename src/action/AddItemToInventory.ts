import { Action } from "entity/action/Action";
import { ActionArgument, anyOf } from "entity/action/IAction";
import Entity from "entity/Entity";
import { EntityType } from "entity/IEntity";
import Player from "entity/player/Player";
import { IContainer } from "item/IItem";
import { defaultUsability } from "../Actions";
import InspectDialog from "../ui/InspectDialog";

/**
 * Adds an item to the inventory of a doodad, human, or tile.
 */
export default new Action(anyOf(ActionArgument.Container, ActionArgument.Player), ActionArgument.ItemType, ActionArgument.Quality)
	.setUsableBy(EntityType.Player)
	.setUsableWhen(...defaultUsability)
	.setHandler((action, target, item, quality) => {
		if (target instanceof Player) {
			target.createItemInInventory(item, quality);

			if (Entity.is(target, EntityType.Player)) {
				target.updateTablesAndWeight();
			}

		} else {
			itemManager.create(item, target as IContainer, quality);
			action.setUpdateView();
		}

		if (InspectDialog.INSTANCE) InspectDialog.INSTANCE.update();
	});
