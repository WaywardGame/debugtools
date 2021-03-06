import Human from "game/entity/Human";

/**
 * Clones the inventory from one human entity to another.
 */
export default function (from: Human, to: Human) {
	for (const item of to.inventory.containedItems) {
		itemManager.remove(item);
	}

	for (const item of to.getEquippedItems()) {
		itemManager.remove(item);
	}

	for (const item of from.inventory.containedItems) {
		const clone = to.createItemInInventory(item.type, item.quality);
		clone.ownerIdentifier = item.ownerIdentifier;
		game.notifier?.suspend();
		clone.minDur = item.minDur;
		game.notifier?.resume();
		clone.maxDur = item.maxDur;
		clone.renamed = item.renamed;
		clone.weight = item.weight;
		clone.magic.inherit(item.magic);
		if (item.isEquipped()) to.equip(clone, item.getEquipSlot()!);
	}
}
