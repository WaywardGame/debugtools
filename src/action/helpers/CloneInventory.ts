/*!
 * Copyright 2011-2024 Unlok
 * https://www.unlok.ca
 *
 * Credits & Thanks:
 * https://www.unlok.ca/credits-thanks/
 *
 * Wayward is a copyrighted and licensed work. Modification and/or distribution of any source files is prohibited. If you wish to modify the game in any way, please refer to the modding guide:
 * https://github.com/WaywardGame/types/wiki
 */

import Human from "@wayward/game/game/entity/Human";

/**
 * Clones the inventory from one human entity to another.
 */
export default function (from: Human, to: Human): void {
	for (const item of [...to.inventory.containedItems]) {
		if (item.isContainer()) {
			to.island.items.removeContainerItems(item);
		}

		to.island.items.remove(item);
	}

	for (const item of [...to.getEquippedItems()]) {
		to.island.items.remove(item);
	}

	for (const item of from.inventory.containedItems) {
		const clone = to.cloneItemIntoInventory(item);
		if (item.isEquipped()) to.equip(clone, item.getEquipSlot()!);
	}
}
