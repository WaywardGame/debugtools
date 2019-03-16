import { ICreature } from "entity/creature/ICreature";
import Entity from "entity/Entity";
import { AiType, EntityType } from "entity/IEntity";
import { INPC } from "entity/npc/INPC";
import { NPCType } from "entity/npc/NPCS";
import IPlayer from "entity/player/IPlayer";
import { IVector3 } from "utilities/math/IVector";
import Vector2 from "utilities/math/Vector2";
import CloneInventory from "./CloneInventory";
import CopyStats from "./CopyStats";

/**
 * Clones an entity to another position. Given a player, clones a matching NPC.
 */
export default function (entity: ICreature | INPC | IPlayer, position: IVector3) {
	let clone: ICreature | INPC | IPlayer;

	if (Entity.is(entity, EntityType.Creature)) {
		clone = creatureManager.spawn(entity.type, position.x, position.y, position.z, true, entity.aberrant)!;

		if (entity.isTamed()) clone.tame(entity.getOwner()!);
		clone.renamed = entity.renamed;
		clone.ai = entity.ai;
		clone.enemy = entity.enemy;
		clone.enemyAttempts = entity.enemyAttempts;
		clone.enemyIsPlayer = entity.enemyIsPlayer;

	} else {
		clone = npcManager.spawn(NPCType.Merchant, position.x, position.y, position.z)!;
		clone.customization = { ...entity.customization };
		clone.renamed = entity.getName().getString();
		CloneInventory(entity, clone);
	}

	clone.direction = new Vector2(entity.direction).raw();
	clone.facingDirection = entity.facingDirection;

	CopyStats(entity, clone);

	if (Entity.is(clone, EntityType.NPC)) {
		clone.ai = AiType.Neutral;
	}
}
