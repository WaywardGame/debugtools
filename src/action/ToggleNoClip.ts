import { Action } from "game/entity/action/Action";
import { ActionArgument } from "game/entity/action/IAction";
import { EntityType, MoveType } from "game/entity/IEntity";
import { RenderSource } from "renderer/IRenderer";
import { defaultUsability } from "../Actions";

export default new Action(ActionArgument.Player)
	.setUsableBy(EntityType.Player)
	.setUsableWhen(...defaultUsability)
	.setHandler((action, player) => {
		if (!player) return;

		player.setMoveType(player.isFlying ? MoveType.Land : MoveType.Flying);

		player.updateView(RenderSource.Mod, true);
	});
