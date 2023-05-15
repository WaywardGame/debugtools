/*!
 * Copyright 2011-2023 Unlok
 * https://www.unlok.ca
 *
 * Credits & Thanks:
 * https://www.unlok.ca/credits-thanks/
 *
 * Wayward is a copyrighted and licensed work. Modification and/or distribution of any source files is prohibited. If you wish to modify the game in any way, please refer to the modding guide:
 * https://github.com/WaywardGame/types/wiki
 */

import { Action } from "game/entity/action/Action";
import { ActionArgument } from "game/entity/action/IAction";
import Human from "game/entity/Human";
import { EntityType } from "game/entity/IEntity";
import { ItemType } from "game/item/IItem";
import Item from "game/item/Item";
import Enums from "utilities/enum/Enums";
import { defaultUsability } from "../Actions";
import InspectDialog from "../ui/InspectDialog";

export const ADD_ITEM_RANDOM = 1000000001;
export const ADD_ITEM_ALL = 1000000002;

/**
 * Adds an item to the inventory of a doodad, human, or tile.
 */
export default new Action(ActionArgument.Container, ActionArgument.Integer32, ActionArgument.Quality, ActionArgument.Integer32)
	.setUsableBy(EntityType.Human)
	.setUsableWhen(...defaultUsability)
	.setHandler((action, target, item: ItemType | typeof ADD_ITEM_RANDOM | typeof ADD_ITEM_ALL, quality, quantity) => {
		const total = Enums.values(ItemType).length - 1;
		if (item === ADD_ITEM_ALL) {
			quantity = total; // we don't want "none"
		}

		const containerObject = action.executor.island.items.resolveContainer(target);

		if (containerObject instanceof Human) {
			oldui.startAddingMultipleItemsToContainer(action.executor.inventory);
		}

		const createdItems: Item[] = [];
		for (let i = 0; i < quantity; i++) {
			const addItem = item === ADD_ITEM_ALL ? i + 1 : item === ADD_ITEM_RANDOM ? action.executor.island.seededRandom.int(total) + 1 : item;
			if (containerObject instanceof Human) {
				const createdItem = containerObject.createItemInInventory(addItem, quality, false);
				createdItems.push(createdItem);
			} else {
				action.executor.island.items.create(addItem, target, quality);
			}
		}

		if (containerObject instanceof Human) {
			oldui.completeAddingMultipleItemsToContainer(action.executor.inventory, createdItems);

			containerObject.updateTablesAndWeight("M");
		} else {
			action.setUpdateView();
		}

		InspectDialog.INSTANCE?.update();
	});
