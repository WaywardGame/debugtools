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

import Human from "game/entity/Human";
import MagicalPropertyManager from "game/magic/MagicalPropertyManager";

/**
 * Clones the inventory from one human entity to another.
 */
export default function (from: Human, to: Human) {
	for (const item of [...to.inventory.containedItems]) {
		from.island.items.remove(item);
	}

	for (const item of [...to.getEquippedItems()]) {
		to.island.items.remove(item);
	}

	for (const item of from.inventory.containedItems) {
		const clone = to.createItemInInventory(item.type, item.quality);
		clone.crafterIdentifier = item.crafterIdentifier;
		renderers.notifier.suspend();
		clone.durability = item.durability;
		renderers.notifier.resume();
		clone.durabilityMax = item.durabilityMax;
		clone.renamed = item.renamed;
		clone.weight = item.weight;
		MagicalPropertyManager.inherit(item, clone);
		if (item.isEquipped()) to.equip(clone, item.getEquipSlot()!);
	}
}
