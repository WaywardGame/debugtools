import { Quality } from "@wayward/game/game/IObject";
import type Human from "@wayward/game/game/entity/Human";
import { EntityType } from "@wayward/game/game/entity/IEntity";
import { Action } from "@wayward/game/game/entity/action/Action";
import type { IActionHandlerApi } from "@wayward/game/game/entity/action/IAction";
import { ActionArgument, ActionUsability } from "@wayward/game/game/entity/action/IAction";
import type Item from "@wayward/game/game/item/Item";
import { defaultCanUseHandler } from "../Actions";
import Mod from "@wayward/game/mod/Mod";
import type DebugTools from "../DebugTools";

const DEBUG_TOOLS = Mod.get<DebugTools>();

/**
 * Sets the quality of an item in a human's inventory
 */
export default new Action(ActionArgument.Item, ActionArgument.ENUM(Quality))
	.setUsableBy(EntityType.Human)
	.setUsableWhen(ActionUsability.Always)
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

	if (human) {
		human.updateTablesAndWeight("M");
	} else {
		action.setUpdateView();
	}

	DEBUG_TOOLS?.instance?.getInspectDialog()?.update();
}
