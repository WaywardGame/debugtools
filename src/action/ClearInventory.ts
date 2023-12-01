/*!
 * Copyright 2011-2023 Unlok
 * https://www.unlok.ca
 *
 * Credits & Thanks:
 * https://www.unlok.ca/credits-thanks/
 *
 * Wayward is a copyrighted and licensed work. Modification and/or distribution of any source files is prohibited. If you wish to modify the game in any way, please refer to the modding guide:
 * https://github.com/WaywardGame/types/wiki
 */

import { Action } from "@wayward/game/game/entity/action/Action";
import { ActionArgument } from "@wayward/game/game/entity/action/IAction";
import Human from "@wayward/game/game/entity/Human";
import { EntityType } from "@wayward/game/game/entity/IEntity";
import { defaultUsability } from "../Actions";
import InspectDialog from "../ui/InspectDialog";

/**
 * Adds an item to the inventory of a doodad, human, or tile.
 */
export default new Action(ActionArgument.Container)
	.setUsableBy(EntityType.Human)
	.setUsableWhen(...defaultUsability)
	.setHandler((action, container) => {
		action.executor.island.items.removeContainerItems(container, { removeContainedItems: true });

		const containerObject = action.executor.island?.items.resolveContainer(container);
		if (containerObject instanceof Human)
			containerObject.updateTablesAndWeight("M");
		else
			action.setUpdateView();

		InspectDialog.INSTANCE?.update();
	});
