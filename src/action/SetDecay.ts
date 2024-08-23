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
 * Sets the decay of all items in a human's inventory
 */
export default new Action(ActionArgument.Item, ActionArgument.Float64)
	.setUsableBy(EntityType.Human)
	.setUsableWhen(...defaultUsability)
	.setCanUse(defaultCanUseHandler)
	.setHandler((action, item, decay) => setDecay(action, decay, item));

export function setDecay(action: IActionHandlerApi<Human>, decay: number, ...items: Item[]): void {
	const canUse = action.canUse();
	if (!canUse.usable) {
		return;
	}

	let owner: Human | undefined;
	for (const item of items) {
		owner ??= item.getCurrentOwner();
		if (item.canDecay()) {
			item.setDecayTime(Number.isInteger(decay) || decay > 1 ? decay : Math.ceil((item.startingDecay ?? 1) * decay));
			if (!item.startingDecay || item.getDecayTime()! > item.startingDecay)
				item.startingDecay = item.getDecayTime();
		}
	}

	if (owner)
		owner.updateTablesAndWeight("M");
	else
		action.setUpdateView();

	InspectDialog.INSTANCE?.update();
}
