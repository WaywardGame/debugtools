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

import Entity from "game/entity/Entity";
import { EntityType } from "game/entity/IEntity";
import { Action } from "game/entity/action/Action";
import { ActionArgument, optional } from "game/entity/action/IAction";
import Player from "game/entity/player/Player";
import Island from "game/island/Island";
import { IVector3 } from "utilities/math/IVector";
import Vector3 from "utilities/math/Vector3";
import { defaultUsability } from "../Actions";
import { DebugToolsTranslation } from "../IDebugTools";
import Remove from "./helpers/Remove";
import { teleportEntity } from "./helpers/TeleportEntity";

/**
 * Runs a miscellaneous command on a selection of things.
 * @param executionType A `DebugToolsTranslation` naming what command to perform.
 * @param selection An array of `[SelectionType, number]` tuples. Each represents a selected thing, such as a creature and its ID. 
 */
export default new Action(ActionArgument.Integer32, ActionArgument.Array, optional(ActionArgument.String))
	.setUsableBy(EntityType.Human)
	.setUsableWhen(...defaultUsability)
	.setHandler((action, executionType: DebugToolsTranslation, selection: [SelectionType, number][], alternativeTarget) => {
		for (const [type, id] of selection) {
			const target = getTarget(action.executor.island, type, id);
			if (!target) continue;

			switch (executionType) {
				case DebugToolsTranslation.ActionRemove:
					if (target instanceof Player) continue;
					if (!(target instanceof Entity) && IVector3.is(target)) continue;
					Remove(action, target);
					break;
				case DebugToolsTranslation.ActionTeleport:
					const playerToTeleport = game.playerManager.getAll(true, true).find(player => player.identifier === alternativeTarget);
					if (playerToTeleport) {
						teleportEntity(action, playerToTeleport, target instanceof Entity ? target.tile : action.executor.island.getTile(...target.xyz));
					}
					return;
			}
		}

		renderers.computeSpritesInViewport(action.executor);
		action.setUpdateRender();
	});

function getTarget(island: Island, type: SelectionType, id: string | number) {
	switch (type) {
		case SelectionType.Creature: return island.creatures.get(id as number);
		case SelectionType.NPC: return island.npcs.get(id as number);
		case SelectionType.TileEvent: return island.tileEvents.get(id as number);
		case SelectionType.Doodad: return island.doodads.get(id as number);
		case SelectionType.Corpse: return island.corpses.get(id as number);
		case SelectionType.Player: return game.playerManager.getAll(true, true).find(player => player.identifier === id);
		case SelectionType.Location: return island.treasureMaps
			.flatMap(map => map.getTreasure()
				.map(treasure => new Vector3(treasure, map.position.z)))
			.find(treasure => treasure.xyz.join(",") === id);
	}
}

export enum SelectionType {
	Creature,
	NPC,
	TileEvent,
	Doodad,
	Corpse,
	Player,
	Location,
}
