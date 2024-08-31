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
