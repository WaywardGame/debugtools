import type Human from "@wayward/game/game/entity/Human";
import { EntityType } from "@wayward/game/game/entity/IEntity";
import { Action } from "@wayward/game/game/entity/action/Action";
import type { IActionHandlerApi } from "@wayward/game/game/entity/action/IAction";
import { ActionArgument, ActionUsability } from "@wayward/game/game/entity/action/IAction";
import type Item from "@wayward/game/game/item/Item";
import { defaultCanUseHandler } from "../Actions";

/**
 * Sets the durability of all items in a human's inventory
 */
export default new Action(ActionArgument.Item, ActionArgument.Float64)
	.setUsableBy(EntityType.Human)
	.setUsableWhen(ActionUsability.Always)
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
		item.durability = Number.isInteger(durability) || durability > 1 ? durability : Math.ceil((item.durabilityMaxWithMagical ?? 1) * durability);
	}

	if (human) {
		human.updateTablesAndWeight("M");
	} else {
		action.setUpdateView();
	}

	debugTools?.getInspectDialog()?.update();
}
