import { ActionApi } from "entity/action/IAction";
import Entity from "entity/Entity";
import Player from "entity/player/Player";
import { gameScreen } from "newui/screen/screens/GameScreen";
import { IVector3 } from "utilities/math/IVector";
import GetPosition from "../../action/helpers/GetPosition";
import { DebugToolsTranslation, translation } from "../../IDebugTools";

export function teleportEntity(action: ActionApi<any>, entity: Entity, position?: IVector3) {

	position = GetPosition(action.executor as Player, position!, () => translation(DebugToolsTranslation.ActionTeleport)
		.get(entity.getName()));

	if (!entity || !position) return;

	if (entity.asCreature) {
		const tile = game.getTile(entity.x, entity.y, entity.z);
		delete tile.creature;
	}

	if (entity.asNPC) {
		const tile = game.getTile(entity.x, entity.y, entity.z);
		delete tile.npc;
	}

	if (entity.asPlayer) {
		entity.asPlayer.setPosition(position);

	} else {
		entity.x = entity.fromX = position.x;
		entity.y = entity.fromY = position.y;
		entity.z = position.z;
	}

	if (entity.asCreature) {
		const tile = game.getTile(entity.x, entity.y, entity.z);
		tile.creature = entity.asCreature;
	}

	if (entity.asNPC) {
		const tile = game.getTile(entity.x, entity.y, entity.z);
		tile.npc = entity.asNPC;
	}

	if (entity === localPlayer) {
		gameScreen!.movementHandler.walkToTileHandler.reset();
	}

	action.setUpdateView(true);
}
