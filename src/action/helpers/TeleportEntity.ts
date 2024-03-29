/*!
 * Copyright 2011-2023 Unlok
 * https://www.unlok.ca
 *
 * Credits & Thanks:
 * https://www.unlok.ca/credits-thanks/
 *
 * Wayward is a copyrighted and licensed work. Modification and/or distribution of any source files is prohibited. If you wish to modify the game in any way, please refer to the modding guide:
 * https://github.com/WaywardGame/types/wiki
 */

import { ActionApi } from "game/entity/action/IAction";
import Entity from "game/entity/Entity";
import Player from "game/entity/player/Player";
import { DebugToolsTranslation, translation } from "../../IDebugTools";
import { getTile } from "./GetTile";
import Tile from "game/tile/Tile";
import { MoveAnimation } from "game/entity/IEntity";

export function teleportEntity(action: ActionApi<any>, entity: Entity, tile: Tile) {
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

	if (entity.asPlayer?.isLocalPlayer()) {
		gameScreen!.movementHandler.walkToTileHandler.reset();
	}

	action.setUpdateView(true);
}
