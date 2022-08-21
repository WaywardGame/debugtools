import Human from "game/entity/Human";

/**
 * Clones the inventory from one human entity to another.
 */
export default function (from: Human, to: Human) {
	for (const item of to.inventory.containedItems) {
		from.island.items.remove(item);
	}

	for (const item of to.getEquippedItems()) {
		to.island.items.remove(item);
	}

	for (const item of from.inventory.containedItems) {
		const clone = to.createItemInInventory(item.type, item.quality);
		clone.crafterIdentifier = item.crafterIdentifier;
		renderers.notifier.suspend();
		clone.minDur = item.minDur;
		renderers.notifier.resume();
		clone.maxDur = item.maxDur;
		clone.renamed = item.renamed;
		clone.weight = item.weight;
		clone.magic.inherit(item.magic);
		if (item.isEquipped()) to.equip(clone, item.getEquipSlot()!);
	}
}
