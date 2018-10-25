import { Action } from "action/Action";
import { ActionArgument } from "action/IAction";
import { EntityType } from "entity/IEntity";
import { IVector3 } from "utilities/math/IVector";
import GetPosition from "../action/helpers/GetPosition";
import { defaultUsability } from "../Actions";
import { DebugToolsTranslation, translation } from "../IDebugTools";

/**
 * Teleports an entity to a position.
 */
export default new Action(ActionArgument.Entity, ActionArgument.Vector3)
	.setUsableBy(EntityType.Player)
	.setUsableWhen(...defaultUsability)
	.setHandler((action, entity, position?: IVector3) => {

		position = GetPosition(action.executor, position!, () => translation(DebugToolsTranslation.ActionTeleport)
			.get(entity!.getName()));

		if (!entity || !position) return;

		if (entity.entityType === EntityType.Creature) {
			const tile = game.getTile(entity.x, entity.y, entity.z);
			delete tile.creature;
		}

		if (entity.entityType === EntityType.NPC) {
			const tile = game.getTile(entity.x, entity.y, entity.z);
			delete tile.npc;
		}

		if (entity.entityType === EntityType.Player) {
			entity.setPosition(position);

		} else {
			entity.x = entity.fromX = position.x;
			entity.y = entity.fromY = position.y;
			entity.z = position.z;
		}

		if (entity.entityType === EntityType.Creature) {
			const tile = game.getTile(entity.x, entity.y, entity.z);
			tile.creature = entity;
		}

		if (entity.entityType === EntityType.NPC) {
			const tile = game.getTile(entity.x, entity.y, entity.z);
			tile.npc = entity;
		}

		game.updateView(true);
	});
