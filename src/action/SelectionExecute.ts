import { Action } from "game/entity/action/Action";
import { ActionArgument, optional } from "game/entity/action/IAction";
import { EntityType } from "game/entity/IEntity";
import Player from "game/entity/player/Player";
import Island from "game/island/Island";
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
	.setUsableBy(EntityType.Player)
	.setUsableWhen(...defaultUsability)
	.setHandler((action, executionType: DebugToolsTranslation, selection: [SelectionType, number][], alternativeTarget) => {
		for (const [type, id] of selection) {
			const target = getTarget(action.executor.island, type, id);
			if (!target) continue;

			switch (executionType) {
				case DebugToolsTranslation.ActionRemove:
					if (target instanceof Player) continue;
					Remove(action, target);
					break;
				case DebugToolsTranslation.ActionTeleport:
					const playerToTeleport = game.playerManager.getAll(true, true).find(player => player.identifier === alternativeTarget);
					if (playerToTeleport) {
						teleportEntity(action, playerToTeleport, target.tile);
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
	}
}

export enum SelectionType {
	Creature,
	NPC,
	TileEvent,
	Doodad,
	Corpse,
	Player,
}
