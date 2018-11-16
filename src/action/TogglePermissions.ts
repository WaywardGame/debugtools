import { Action } from "action/Action";
import { ActionArgument } from "action/IAction";
import { EntityType } from "entity/IEntity";
import Actions, { defaultUsability } from "../Actions";

export default new Action(ActionArgument.Player, ActionArgument.Boolean)
	.setUsableBy(EntityType.Player)
	.setUsableWhen(...defaultUsability)
	.setHandler((action, player, permissions) => {
		if (!player) return;

		Actions.DEBUG_TOOLS.setPlayerData(player, "permissions", permissions);
	});