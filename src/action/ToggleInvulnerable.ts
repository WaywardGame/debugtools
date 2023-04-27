import { Action } from "game/entity/action/Action";
import { ActionArgument } from "game/entity/action/IAction";
import { EntityType } from "game/entity/IEntity";
import Actions, { defaultUsability } from "../Actions";

export default new Action(ActionArgument.Player, ActionArgument.Boolean)
	.setUsableBy(EntityType.Human)
	.setUsableWhen(...defaultUsability)
	.setHandler((action, player, invulnerable) => {
		Actions.DEBUG_TOOLS.setPlayerData(player, "invulnerable", invulnerable);
	});
