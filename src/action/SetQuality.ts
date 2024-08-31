import { Quality } from "@wayward/game/game/IObject";
import Human from "@wayward/game/game/entity/Human";
import { EntityType } from "@wayward/game/game/entity/IEntity";
import { Action } from "@wayward/game/game/entity/action/Action";
import { ActionArgument, IActionHandlerApi } from "@wayward/game/game/entity/action/IAction";
import Item from "@wayward/game/game/item/Item";
import { defaultCanUseHandler, defaultUsability } from "../Actions";
import InspectDialog from "../ui/InspectDialog";

/**
 * Sets the quality of an item in a human's inventory
 */
export default new Action(ActionArgument.Item, ActionArgument.ENUM(Quality))
	.setUsableBy(EntityType.Human)
	.setUsableWhen(...defaultUsability)
	.setCanUse(defaultCanUseHandler)
	.setHandler((action, item, quality) => setQuality(action, quality, item));

export function setQuality(action: IActionHandlerApi<Human>, quality: Quality, ...items: Item[]): void {
	const canUse = action.canUse();
	if (!canUse.usable) {
		return;
	}

	let human: Human | undefined;
	for (const item of items) {
		human ??= item.getCurrentOwner();
		item.setQuality(human, quality);
	}

	if (human)
		human.updateTablesAndWeight("M");
	else
		action.setUpdateView();

	InspectDialog.INSTANCE?.update();
}
