import { ActionApi } from "entity/action/IAction";
import Entity from "entity/Entity";
import { EntityType } from "entity/IEntity";
import Player from "entity/player/Player";
import { IVector3 } from "utilities/math/IVector";

import GetPosition from "../../action/helpers/GetPosition";
import { DebugToolsTranslation, translation } from "../../IDebugTools";

export function teleportEntity(action: ActionApi<any>, entity: Entity, position?: IVector3) {

	position = GetPosition(action.executor as Player, position!, () => translation(DebugToolsTranslation.ActionTeleport)
		.get(entity!.getName()));

	if (!entity || !position) return;

	if (Entity.is(entity, EntityType.Creature)) {
		const tile = game.getTile(entity.x, entity.y, entity.z);
		delete tile.creature;
	}

	if (Entity.is(entity, EntityType.NPC)) {
		const tile = game.getTile(entity.x, entity.y, entity.z);
		delete tile.npc;
	}

	if (Entity.is(entity, EntityType.Player)) {
		entity.setPosition(position);

	} else {
		entity.x = entity.fromX = position.x;
		entity.y = entity.fromY = position.y;
		entity.z = position.z;
	}

	if (Entity.is(entity, EntityType.Creature)) {
		const tile = game.getTile(entity.x, entity.y, entity.z);
		tile.creature = entity;
	}

	if (Entity.is(entity, EntityType.NPC)) {
		const tile = game.getTile(entity.x, entity.y, entity.z);
		tile.npc = entity;
	}

	if (entity === localPlayer) {
		gameScreen!.movementHandler.walkToTileHandler.reset();
	}

	action.setUpdateView(true);
}
