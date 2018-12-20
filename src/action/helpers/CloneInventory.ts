import IHuman from "entity/IHuman";

/**
 * Clones the inventory from one human entity to another.
 */
export default function (from: IHuman, to: IHuman) {
	for (const item of to.inventory.containedItems) {
		itemManager.remove(item);
	}

	for (const item of to.getEquippedItems()) {
		itemManager.remove(item);
	}

	for (const item of from.inventory.containedItems) {
		const clone = to.createItemInInventory(item.type, item.quality);
		clone.ownerIdentifier = item.ownerIdentifier;
		clone.minDur = item.minDur;
		clone.maxDur = item.maxDur;
		clone.renamed = item.renamed;
		clone.weight = item.weight;
		clone.weightCapacity = item.weightCapacity;
		clone.legendary = item.legendary && { ...item.legendary };
		if (item.isEquipped()) to.equip(clone, item.getEquipSlot()!);
	}
}
