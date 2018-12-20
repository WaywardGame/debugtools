import { Action } from "action/Action";
import { ActionArgument } from "action/IAction";
import { EntityType } from "entity/IEntity";
import { Delay, MoveType } from "Enums";
import Actions, { defaultUsability } from "../Actions";

export default new Action(ActionArgument.Player, ActionArgument.Boolean)
	.setUsableBy(EntityType.Player)
	.setUsableWhen(...defaultUsability)
	.setHandler((action, player, noclip) => {

		if (!player) return;

		Actions.DEBUG_TOOLS.setPlayerData(player, "noclip", noclip ? {
			moving: false,
			delay: Delay.Movement,
		} : false);

		player.setMoveType(noclip ? MoveType.Flying : MoveType.Land);
		
		game.updateView(true);
	});
