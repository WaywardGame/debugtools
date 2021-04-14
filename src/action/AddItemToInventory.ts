import { Action } from "game/entity/action/Action";
import { ActionArgument, anyOf } from "game/entity/action/IAction";
import { EntityType } from "game/entity/IEntity";
import { ItemType } from "game/item/IItem";
import Enums from "utilities/enum/Enums";
import seededRandom from "utilities/random/Random";
import { defaultUsability } from "../Actions";
import InspectDialog from "../ui/InspectDialog";

export const ADD_ITEM_RANDOM = 1000000001;
export const ADD_ITEM_ALL = 1000000002;

/**
 * Adds an item to the inventory of a doodad, human, or tile.
 */
export default new Action(anyOf(ActionArgument.Container, ActionArgument.Player), ActionArgument.Integer, ActionArgument.Quality, ActionArgument.Integer)
	.setUsableBy(EntityType.Player)
	.setUsableWhen(...defaultUsability)
	.setHandler((action, target, item: ItemType | typeof ADD_ITEM_RANDOM | typeof ADD_ITEM_ALL, quality, quantity) => {
		const total = Enums.values(ItemType).length - 1;
		if (item === ADD_ITEM_ALL) {
			quantity = total; // we don't want "none"
		}

		for (let i = 0; i < quantity; i++) {
			const addItem = item === ADD_ITEM_ALL ? i + 1 : item === ADD_ITEM_RANDOM ? seededRandom.int(total) + 1 : item;
			if ("entityType" in target) {
				target.createItemInInventory(addItem, quality);

			} else {
				itemManager.create(addItem, target, quality);
			}
		}

		if ("entityType" in target) {
			target.updateTablesAndWeight("M");

		} else {
			action.setUpdateView();
		}

		if (InspectDialog.INSTANCE) InspectDialog.INSTANCE.update();
	});
