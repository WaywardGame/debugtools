import Creature from "game/entity/creature/Creature";
import Entity from "game/entity/Entity";
import { AiType } from "game/entity/IEntity";
import { NPCType } from "game/entity/npc/INPCs";
import NPC from "game/entity/npc/NPC";
import { IVector3 } from "utilities/math/IVector";
import CloneInventory from "./CloneInventory";
import CopyStats from "./CopyStats";

/**
 * Clones an entity to another position. Given a player, clones a matching NPC.
 */
export default function (entity: Entity, position: IVector3) {
	let clone: Creature | NPC;

	const creature = entity.asCreature;
	if (creature) {
		clone = entity.island.creatures.spawn(creature.type, position.x, position.y, position.z, true, creature.aberrant, undefined, true)!;

		if (creature.isTamed()) clone.tame(creature.getOwner()!);
		clone.renamed = entity.renamed;
		clone.ai = creature.ai;
		clone.enemy = creature.enemy;
		clone.enemyAttempts = creature.enemyAttempts;
		clone.enemyIsPlayer = creature.enemyIsPlayer;

	} else {
		const npc = entity.asNPC!;
		clone = entity.island.npcs.spawn(NPCType.Merchant, position.x, position.y, position.z)!;
		clone.customization = { ...npc.customization };
		clone.renamed = entity.getName().getString();
		CloneInventory(npc, clone);
	}

	clone.direction = entity.direction.copy();
	clone.facingDirection = entity.facingDirection;

	CopyStats(entity, clone);

	if (clone.asNPC) {
		clone.ai = AiType.Neutral;
	}
}
