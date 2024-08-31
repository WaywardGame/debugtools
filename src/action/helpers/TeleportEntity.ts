import { ActionApi } from "@wayward/game/game/entity/action/IAction";
import Entity from "@wayward/game/game/entity/Entity";
import { MoveAnimation } from "@wayward/game/game/entity/IEntity";
import Player from "@wayward/game/game/entity/player/Player";
import Tile from "@wayward/game/game/tile/Tile";
import { DebugToolsTranslation, translation } from "../../IDebugTools";
import { getTile } from "./GetTile";

export function teleportEntity(action: ActionApi<any>, entity: Entity, tile: Tile): void {
	const canUse = action.canUse();
	if (!canUse.usable) {
		return;
	}

	const targetTile = getTile(action.executor as Player, tile, () => translation(DebugToolsTranslation.ActionTeleport)
		.get(entity.getName()));

	if (!entity || !targetTile) return;

	if (entity.asPlayer) {
		entity.asPlayer.setPosition(targetTile);

	} else {
		const entityMovable = entity.asEntityMovable;
		if (entityMovable) {
			entityMovable.moveTo(targetTile, { animation: MoveAnimation.Teleport });

		} else {
			entity.x = targetTile.x;
			entity.y = targetTile.y;
			entity.z = targetTile.z;
			entity.clearTileCache();
		}
	}

	if (entity.asPlayer?.isLocalPlayer) {
		gameScreen?.interactionManager.pathing.reset();
	}

	action.setUpdateView(true);
}
