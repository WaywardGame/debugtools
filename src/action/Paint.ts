import { Action } from "game/entity/action/Action";
import { ActionArgument } from "game/entity/action/IAction";
import { EntityType } from "game/entity/IEntity";
import TileHelpers from "utilities/game/TileHelpers";
import { defaultUsability } from "../Actions";
import { IPaintData } from "../ui/panel/PaintPanel";
import { getTilePosition } from "../util/TilePosition";
import SetTilled from "./helpers/SetTilled";

/**
 * Places terrain, creatures, NPCs, doodads, corpses, and/or tile events on the given tiles.
 * @param tiles An array of tile IDs
 * @param data The data to paint (terrain, creature, npc, etc)
 */
// tslint:disable cyclomatic-complexity
export default new Action(ActionArgument.Array, ActionArgument.Object)
	.setUsableBy(EntityType.Player)
	.setUsableWhen(...defaultUsability)
	.setHandler((action, tiles: number[], data: IPaintData) => {

		for (const tileId of tiles) {
			const [x, y, z] = getTilePosition(tileId);
			const tile = action.executor.island.getTile(x, y, z);
			for (const k of Object.keys(data)) {
				const paintType = k as keyof IPaintData;
				switch (paintType) {
					case "terrain": {
						action.executor.island.changeTile(data.terrain!.type, x, y, z, false);
						if (data.terrain!.tilled !== undefined && data.terrain!.tilled !== TileHelpers.isTilled(tile))
							SetTilled(action.executor.island, x, y, z, data.terrain!.tilled);
						break;
					}
					case "creature": {
						const creature = tile.creature;
						if (creature) action.executor.island.creatures.remove(creature);

						const type = data.creature!.type;
						if (type !== "remove") {
							action.executor.island.creatures.spawn(type, x, y, z, true, data.creature!.aberrant, undefined, true);
						}

						break;
					}
					case "npc": {
						const npc = tile.npc;
						if (npc) action.executor.island.npcs.remove(npc);

						const type = data.npc!.type;
						if (type !== "remove") {
							action.executor.island.npcs.spawn(type, x, y, z, { allowEdgeSpawning: true, allowOverDooadsAndTileEvents: true, allowOnFire: true, allowOnBlockedTiles: true });
						}

						break;
					}
					case "doodad": {
						const doodad = tile.doodad;
						if (doodad) action.executor.island.doodads.remove(doodad);

						const type = data.doodad!.type;
						if (type !== "remove") {
							action.executor.island.doodads.create(type, x, y, z);
						}

						break;
					}
					case "corpse": {
						if (data.corpse!.replaceExisting || data.corpse!.type === "remove") {
							const corpses = tile.corpses;
							if (corpses) {
								for (const corpse of corpses) {
									action.executor.island.corpses.remove(corpse);
								}
							}
						}

						const type = data.corpse!.type;
						if (type !== undefined && type !== "remove") {
							action.executor.island.corpses.create(type, x, y, z, undefined, data.corpse!.aberrant);
						}

						break;
					}
					case "tileEvent": {
						if (data.tileEvent!.replaceExisting || data.tileEvent!.type === "remove") {
							const tileEvents = tile.events;
							if (tileEvents) {
								for (const event of tileEvents) {
									action.executor.island.tileEvents.remove(event);
								}
							}
						}

						const type = data.tileEvent!.type;
						if (type !== undefined && type !== "remove") {
							action.executor.island.tileEvents.create(type, x, y, z);
						}

						break;
					}
				}
			}
		}
	});
