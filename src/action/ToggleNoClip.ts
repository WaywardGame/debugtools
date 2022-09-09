import { Action } from "game/entity/action/Action";
import { ActionArgument } from "game/entity/action/IAction";
import { EntityType, MoveType } from "game/entity/IEntity";
import { Delay } from "game/entity/IHuman";
import { RenderSource } from "renderer/IRenderer";
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

		renderers.updateView(RenderSource.Mod, true);
	});
