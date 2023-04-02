import { ActionApi } from "game/entity/action/IAction";
import Entity from "game/entity/Entity";
import Player from "game/entity/player/Player";
import { DebugToolsTranslation, translation } from "../../IDebugTools";
import { getTile } from "./GetTile";
import Tile from "game/tile/Tile";

export function teleportEntity(action: ActionApi<any>, entity: Entity, tile: Tile) {
	const targetTile = getTile(action.executor as Player, tile, () => translation(DebugToolsTranslation.ActionTeleport)
		.get(entity.getName()));

	if (!entity || !targetTile) return;

	if (entity.asCreature) {
		const tile = action.executor.island.getTile(entity.x, entity.y, entity.z);
		delete tile.creature;
	}

	if (entity.asNPC) {
		const tile = action.executor.island.getTile(entity.x, entity.y, entity.z);
		delete tile.npc;
	}

	if (entity.asPlayer) {
		entity.asPlayer.setPosition(targetTile);

	} else {
		entity.x = targetTile.x;
		entity.y = targetTile.y;
		entity.z = targetTile.z;

		const entityMovable = entity.asEntityMovable;
		if (entityMovable) {
			entityMovable.fromX = entity.x;
			entityMovable.fromY = entity.y;
		}
	}

	if (entity.asCreature) {
		const tile = action.executor.island.getTile(entity.x, entity.y, entity.z);
		tile.creature = entity.asCreature;
	}

	if (entity.asNPC) {
		const tile = action.executor.island.getTile(entity.x, entity.y, entity.z);
		tile.npc = entity.asNPC;
	}

	if (entity.asPlayer?.isLocalPlayer()) {
		gameScreen!.movementHandler.walkToTileHandler.reset();
	}

	action.setUpdateView(true);
}
