/*!
 * Copyright 2011-2024 Unlok
 * https://www.unlok.ca
 *
 * Credits & Thanks:
 * https://www.unlok.ca/credits-thanks/
 *
 * Wayward is a copyrighted and licensed work. Modification and/or distribution of any source files is prohibited. If you wish to modify the game in any way, please refer to the modding guide:
 * https://github.com/WaywardGame/types/wiki
 */

import { AiType } from "@wayward/game/game/entity/AI";
import Creature from "@wayward/game/game/entity/creature/Creature";
import Entity from "@wayward/game/game/entity/Entity";
import EntityWithStats from "@wayward/game/game/entity/EntityWithStats";
import { NPCType } from "@wayward/game/game/entity/npc/INPCs";
import NPC from "@wayward/game/game/entity/npc/NPC";
import Tile from "@wayward/game/game/tile/Tile";
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
		clone = entity.island.creatures.spawn(creature.type, tile, true, creature.aberrant, undefined, true)!;

		if (creature.isTamed) clone.tame(creature.getOwner()!);
		clone.renamed = entity.renamed;
		clone.setAiType(creature.ai);
		clone.enemy = creature.enemy;

	} else if (human) {
		clone = entity.island.npcs.create(NPCType.Merchant, tile)!;
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
