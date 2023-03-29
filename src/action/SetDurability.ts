import Human from "game/entity/Human";
import { EntityType } from "game/entity/IEntity";
import { Action } from "game/entity/action/Action";
import { ActionArgument, IActionHandlerApi } from "game/entity/action/IAction";
import Player from "game/entity/player/Player";
import Item from "game/item/Item";
import { defaultUsability } from "../Actions";
import InspectDialog from "../ui/InspectDialog";

/**
 * Sets the durability of all items in a human's inventory
 */
export default new Action(ActionArgument.Item, ActionArgument.Integer32)
	.setUsableBy(EntityType.Player)
	.setUsableWhen(...defaultUsability)
	.setHandler((action, item, durability) => setDurability(action, durability, item));

export function setDurability(action: IActionHandlerApi<Player>, durability: number, ...items: Item[]) {
	let human: Human | undefined;
	for (const item of items) {
		human ??= item.getCurrentOwner();
		item.durability = durability;
		if (item.durability > item.durabilityMax)
			item.durabilityMax = item.durability;

		oldui.updateItem(item, true);
	}

	if (human)
		human.updateTablesAndWeight("M");
	else
		action.setUpdateView();

	InspectDialog.INSTANCE?.update();
}
