import Human from "@wayward/game/game/entity/Human";
import { EntityType } from "@wayward/game/game/entity/IEntity";
import { Action } from "@wayward/game/game/entity/action/Action";
import { ActionArgument, ActionUsability } from "@wayward/game/game/entity/action/IAction";
import Mod from "@wayward/game/mod/Mod";
import { defaultCanUseHandler } from "../Actions";
import type DebugTools from "../DebugTools";
import { createMagicalPropertySpecimens } from "./helpers/MagicalPropertySpecimens";

const DEBUG_TOOLS = Mod.get<DebugTools>();

export default new Action(ActionArgument.Container)
	.setUsableBy(EntityType.Human)
	.setUsableWhen(ActionUsability.Always)
	.setCanUse(defaultCanUseHandler)
	.setHandler((action, container) => {
		createMagicalPropertySpecimens(action.executor, container);

		const containerObject = action.executor.island.items.resolveContainer(container);
		if (containerObject instanceof Human) {
			containerObject.updateTablesAndWeight("M");
		} else {
			action.setUpdateView();
		}

		DEBUG_TOOLS?.instance?.getInspectDialog()?.update();
	})
	.modRegistration("AddItemsWithAllMagicalProperties");