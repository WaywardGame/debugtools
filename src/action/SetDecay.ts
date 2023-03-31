import Human from "game/entity/Human";
import { EntityType } from "game/entity/IEntity";
import { Action } from "game/entity/action/Action";
import { ActionArgument, IActionHandlerApi } from "game/entity/action/IAction";
import Player from "game/entity/player/Player";
import Item from "game/item/Item";
import { defaultUsability } from "../Actions";
import InspectDialog from "../ui/InspectDialog";

/**
 * Sets the decay of all items in a human's inventory
 */
export default new Action(ActionArgument.Item, ActionArgument.Float64)
	.setUsableBy(EntityType.Player)
	.setUsableWhen(...defaultUsability)
	.setHandler((action, item, decay) => setDecay(action, decay, item));

export function setDecay(action: IActionHandlerApi<Player>, decay: number, ...items: Item[]) {
	let owner: Human | undefined;
	for (const item of items) {
		owner ??= item.getCurrentOwner();
		if (item.canDecay()) {
			item.decay = Number.isInteger(decay) || decay > 1 ? decay : Math.ceil((item.startingDecay ?? 1) * decay);
			if (!item.startingDecay || item.decay > item.startingDecay)
				item.startingDecay = item.decay;

			oldui.updateItem(item, true);
		}
	}

	if (owner)
		owner.updateTablesAndWeight("M");
	else
		action.setUpdateView();

	InspectDialog.INSTANCE?.update();
}
