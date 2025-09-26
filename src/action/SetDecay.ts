import type Human from "@wayward/game/game/entity/Human";
import { EntityType } from "@wayward/game/game/entity/IEntity";
import { Action } from "@wayward/game/game/entity/action/Action";
import type { IActionHandlerApi } from "@wayward/game/game/entity/action/IAction";
import { ActionArgument, ActionUsability } from "@wayward/game/game/entity/action/IAction";
import type Item from "@wayward/game/game/item/Item";
import { defaultCanUseHandler } from "../Actions";

/**
 * Sets the decay of all items in a human's inventory
 */
export default new Action(ActionArgument.Item, ActionArgument.Float64)
	.setUsableBy(EntityType.Human)
	.setUsableWhen(ActionUsability.Always)
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
			if (!item.startingDecay || item.getDecayTime()! > item.startingDecay) {
				item.startingDecay = item.getDecayTime();
			}
		}
	}

	if (owner) {
		owner.updateTablesAndWeight("M");
	} else {
		action.setUpdateView();
	}

	debugTools?.getInspectDialog()?.update();
}
