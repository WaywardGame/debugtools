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
