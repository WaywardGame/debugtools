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
import { EntityType } from "@wayward/game/game/entity/IEntity";
import { Action } from "@wayward/game/game/entity/action/Action";
import { ActionArgument, IActionHandlerApi } from "@wayward/game/game/entity/action/IAction";
import Item from "@wayward/game/game/item/Item";
import { defaultCanUseHandler, defaultUsability } from "../Actions";
import InspectDialog from "../ui/InspectDialog";

/**
 * Sets the durability of all items in a human's inventory
 */
export default new Action(ActionArgument.Item, ActionArgument.Float64)
	.setUsableBy(EntityType.Human)
	.setUsableWhen(...defaultUsability)
	.setCanUse(defaultCanUseHandler)
	.setHandler((action, item, durability) => setDurability(action, durability, item));

export function setDurability(action: IActionHandlerApi<Human>, durability: number, ...items: Item[]): void {
	const canUse = action.canUse();
	if (!canUse.usable) {
		return;
	}

	let human: Human | undefined;
	for (const item of items) {
		human ??= item.getCurrentOwner();
		item.durability = Number.isInteger(durability) || durability > 1 ? durability : Math.ceil((item.durabilityMax ?? 1) * durability);
	}

	if (human)
		human.updateTablesAndWeight("M");
	else
		action.setUpdateView();

	InspectDialog.INSTANCE?.update();
}
