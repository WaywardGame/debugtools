import { Action } from "game/entity/action/Action";
import { ActionArgument } from "game/entity/action/IAction";
import Human from "game/entity/Human";
import { EntityType } from "game/entity/IEntity";
import { defaultUsability } from "../Actions";
import InspectDialog from "../ui/InspectDialog";

/**
 * Adds an item to the inventory of a doodad, human, or tile.
 */
export default new Action(ActionArgument.Container)
	.setUsableBy(EntityType.Human)
	.setUsableWhen(...defaultUsability)
	.setHandler((action, container) => {
		action.executor.island.items.removeContainerItems(container, true);

		const containerObject = action.executor.island?.items.resolveContainer(container);
		if (containerObject instanceof Human)
			containerObject.updateTablesAndWeight("M");
		else
			action.setUpdateView();

		InspectDialog.INSTANCE?.update();
	});
