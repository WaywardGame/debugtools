import { EntityType } from "@wayward/game/game/entity/IEntity";
import { Action } from "@wayward/game/game/entity/action/Action";
import { ActionArgument } from "@wayward/game/game/entity/action/IAction";
import Translation from "@wayward/game/language/Translation";
import { defaultCanUseHandler, defaultUsability } from "../Actions";

export default new Action(ActionArgument.String)
	.setUsableBy(EntityType.Human)
	.setUsableWhen(...defaultUsability)
	.setCanUse(defaultCanUseHandler)
	.setHandler((action, name) => {
		if (!name || action.executor.island.name === name)
			return;

		action.setContext(undefined, Translation.merge(action.executor.island.getName()), { NEW_NAME: name });
		action.executor.island.name = name === action.executor.island.id ? undefined : name;
	});
