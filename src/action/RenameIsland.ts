import { Action } from "game/entity/action/Action";
import { ActionArgument } from "game/entity/action/IAction";
import { EntityType } from "game/entity/IEntity";
import { defaultUsability } from "../Actions";

export default new Action(ActionArgument.String)
	.setUsableBy(EntityType.Player)
	.setUsableWhen(...defaultUsability)
	.setHandler((action, name) => {
		if (!name || island.name === name)
			return;

		island.name = name === island.id ? undefined : name;
	});
