import Island from "@wayward/game/game/island/Island";
import { IContainer } from "@wayward/game/game/item/IItem";

/**
 * Clones the items in one container to another. If a container is empty or invalid, returns silently.
 */
export default function (island: Island, from: Partial<IContainer>, to: Partial<IContainer>): void {
	if (!("containedItems" in from) || !("containedItems" in to)) return;

	for (const item of from.containedItems || []) {
		const clone = island.items.create(item.type, to as IContainer, item.quality);
		clone.copyPropertiesFrom(item);
	}
}
