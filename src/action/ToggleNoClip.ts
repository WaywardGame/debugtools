import { Action } from "@wayward/game/game/entity/action/Action";
import { ActionArgument } from "@wayward/game/game/entity/action/IAction";
import { EntityType, MoveType } from "@wayward/game/game/entity/IEntity";
import { RenderSource } from "@wayward/game/renderer/IRenderer";
import { defaultCanUseHandler, defaultUsability } from "../Actions";

export default new Action(ActionArgument.Player)
	.setUsableBy(EntityType.Human)
	.setUsableWhen(...defaultUsability)
	.setCanUse(defaultCanUseHandler)
	.setHandler((action, player) => {
		if (!player) return;

		player.setMoveType(player.isFlying ? MoveType.Land : MoveType.Flying);

		player.updateView(RenderSource.Mod, true);
	});
