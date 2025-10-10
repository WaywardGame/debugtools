import { AiType } from "@wayward/game/game/entity/ai/AI";
import type Creature from "@wayward/game/game/entity/creature/Creature";
import type Entity from "@wayward/game/game/entity/Entity";
import type EntityWithStats from "@wayward/game/game/entity/EntityWithStats";
import { NPCType } from "@wayward/game/game/entity/npc/INPCs";
import type NPC from "@wayward/game/game/entity/npc/NPC";
import type Tile from "@wayward/game/game/tile/Tile";
import { Direction } from "@wayward/game/utilities/math/Direction";
import Vector2 from "@wayward/game/utilities/math/Vector2";
import CloneInventory from "./CloneInventory";
import CopyStats from "./CopyStats";

/**
 * Clones an entity to another position. Given a player, clones a matching NPC.
 */
export default function (entity: Entity, tile: Tile): void {
	let clone: Creature | NPC | undefined;

	const creature = entity.asCreature;
	const human = entity.asHuman;
	if (creature) {
		clone = entity.island.creatures.spawn(creature.type, tile, { bypassTiles: true, forceAberrant: creature.aberrant, bypassCreatureLimit: true })!;

		if (creature.isTamed) {
			clone.tame(creature.getOwner()!);
		}

		clone.renamed = entity.renamed;
		clone.ai.calculate();
		clone.ai.ai = creature.ai.ai;
		clone.ai.aiMasks = creature.ai.aiMasks.slice();
		clone.ai.calculate();
		clone.enemy = creature.enemy;

	} else if (human) {
		clone = entity.island.npcs.create(NPCType.Merchant, tile)!;
		clone.customization = { ...human.customization };
		clone.renamed = entity.getName().getString();
		CloneInventory(human, clone);
	}

	if (!clone) {
		return;
	}

	const entityMovable = entity.asEntityMovable;
	if (entityMovable) {
		clone.direction = entityMovable.direction?.copy() ?? Vector2.ZERO;
		clone.facingDirection = entityMovable.facingDirection ?? Direction.South;
	}

	if (entity.asEntityWithStats) {
		CopyStats(entity as EntityWithStats, clone);
	}

	if (clone.asNPC) {
		clone.ai.setBase(AiType.Neutral);
	}
}
