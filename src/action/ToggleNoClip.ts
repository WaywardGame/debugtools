import { Action } from "@wayward/game/game/entity/action/Action";
import { ActionArgument, ActionUsability } from "@wayward/game/game/entity/action/IAction";
import { EntityType, MoveType } from "@wayward/game/game/entity/IEntity";
import { RenderSource } from "@wayward/game/renderer/IRenderer";
import { defaultCanUseHandler } from "../Actions";

export default new Action(ActionArgument.Player)
	.setUsableBy(EntityType.Human)
	.setUsableWhen(ActionUsability.Always)
	.setCanUse(defaultCanUseHandler)
	.setHandler((action, player) => {
		if (!player) {
			return;
		}

		player.setMoveType(player.isFlying ? MoveType.Land : MoveType.Flying);

		player.updateView(RenderSource.Mod, true);
	});
