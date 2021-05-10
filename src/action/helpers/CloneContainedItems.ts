import { IContainer } from "game/item/IItem";

/**
 * Clones the items in one container to another. If a container is empty or invalid, returns silently.
 */
export default function (from: Partial<IContainer>, to: Partial<IContainer>) {
	if (!("containedItems" in from) || !("containedItems" in to)) return;

	for (const item of from.containedItems || []) {
		const clone = itemManager.create(item.type, to as IContainer, item.quality);
		clone.ownerIdentifier = item.ownerIdentifier;
		game.notifier?.suspend();
		clone.minDur = item.minDur;
		game.notifier?.resume();
		clone.maxDur = item.maxDur;
		clone.renamed = item.renamed;
		clone.weight = item.weight;
		clone.magic.inherit(item.magic);
	}
}
