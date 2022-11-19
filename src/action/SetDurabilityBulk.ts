import { Action } from "game/entity/action/Action";
import { ActionArgument } from "game/entity/action/IAction";
import Human from "game/entity/Human";
import { EntityType } from "game/entity/IEntity";
import Island from "game/island/Island";
import { defaultUsability } from "../Actions";
import InspectDialog from "../ui/InspectDialog";

/**
 * Sets the durability of all items in a human's inventory
 */
export default new Action(ActionArgument.Container, ActionArgument.Integer32)
	.setUsableBy(EntityType.Player)
	.setUsableWhen(...defaultUsability)
	.setHandler((action, target, durability) => {
		let island: Island | undefined;
		for (const item of target.containedItems) {
			island ??= item.island;
			item.durability = durability;
		}

		const containerObject = island?.items.resolveContainer(target);
		if (containerObject instanceof Human)
			containerObject.updateTablesAndWeight("M");
		else
			action.setUpdateView();

		oldui.syncItemElements(target.containedItems.map(item => item.id));

		InspectDialog.INSTANCE?.update();
	});
