import Creature from "game/entity/creature/Creature";
import Entity from "game/entity/Entity";
import EntityWithStats from "game/entity/EntityWithStats";
import { AiType } from "game/entity/IEntity";
import { NPCType } from "game/entity/npc/INPCs";
import NPC from "game/entity/npc/NPC";
import Tile from "game/tile/Tile";
import { Direction } from "utilities/math/Direction";
import Vector2 from "utilities/math/Vector2";
import CloneInventory from "./CloneInventory";
import CopyStats from "./CopyStats";

/**
 * Clones an entity to another position. Given a player, clones a matching NPC.
 */
export default function (entity: Entity, tile: Tile) {
	let clone: Creature | NPC | undefined;

	const creature = entity.asCreature;
	const human = entity.asHuman;
	if (creature) {
		clone = entity.island.creatures.spawn(creature.type, tile, true, creature.aberrant, undefined, true)!;

		if (creature.isTamed()) clone.tame(creature.getOwner()!);
		clone.renamed = entity.renamed;
		clone.ai = creature.ai;
		clone.enemy = creature.enemy;

	} else if (human) {
		clone = entity.island.npcs.spawn(NPCType.Merchant, tile)!;
		clone.customization = { ...human.customization };
		clone.renamed = entity.getName().getString();
		CloneInventory(human, clone);
	}

	if (!clone)
		return;

	const entityMovable = entity.asEntityMovable;
	if (entityMovable) {
		clone.direction = entityMovable.direction?.copy() ?? Vector2.ZERO;
		clone.facingDirection = entityMovable.facingDirection ?? Direction.South;
	}

	if (entity.asEntityWithStats) {
		CopyStats(entity as EntityWithStats, clone);
	}

	if (clone.asNPC) {
		clone.ai = AiType.Neutral;
	}
}
