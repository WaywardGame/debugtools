import Island from "game/island/Island";
import { IContainer } from "game/item/IItem";
import MagicalPropertyManager from "game/magic/MagicalPropertyManager";

/**
 * Clones the items in one container to another. If a container is empty or invalid, returns silently.
 */
export default function (island: Island, from: Partial<IContainer>, to: Partial<IContainer>) {
	if (!("containedItems" in from) || !("containedItems" in to)) return;

	for (const item of from.containedItems || []) {
		const clone = island.items.create(item.type, to as IContainer, item.quality);
		clone.crafterIdentifier = item.crafterIdentifier;
		renderers.notifier.suspend();
		clone.durability = item.durability;
		renderers.notifier.resume();
		clone.durabilityMax = item.durabilityMax;
		clone.renamed = item.renamed;
		clone.weight = item.weight;
		MagicalPropertyManager.inherit(item, clone);
	}
}
