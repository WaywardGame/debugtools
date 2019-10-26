import { Action } from "entity/action/Action";
import { ActionArgument } from "entity/action/IAction";
import { EntityType, MoveType } from "entity/IEntity";
import { Delay } from "entity/IHuman";
import { RenderSource } from "game/IGame";
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

		game.updateView(RenderSource.Mod, true);
	});
