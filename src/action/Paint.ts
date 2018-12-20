import { Action } from "action/Action";
import { ActionArgument } from "action/IAction";
import { EntityType } from "entity/IEntity";
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
			// const tile = game.getTile(x, y, z);
			for (const k in data) {
				const paintType = k as keyof IPaintData;
				switch (paintType) {
					case "terrain": {
						game.changeTile(data.terrain!.type, x, y, z, false);
						if (data.terrain!.tilled !== undefined) SetTilled(x, y, z, data.terrain!.tilled);
						break;
					}
					case "creature": {
						const creature = game.getTile(x, y, z).creature;
						if (creature) creatureManager.remove(creature);

						const type = data.creature!.type;
						if (type !== "remove") {
							creatureManager.spawn(type, x, y, z, true, data.creature!.aberrant);
						}

						break;
					}
					case "npc": {
						const npc = game.getTile(x, y, z).npc;
						if (npc) npcManager.remove(npc);

						const type = data.npc!.type;
						if (type !== "remove") {
							npcManager.spawn(type, x, y, z);
						}

						break;
					}
					case "doodad": {
						const doodad = game.getTile(x, y, z).doodad;
						if (doodad) doodadManager.remove(doodad);

						const type = data.doodad!.type;
						if (type !== "remove") {
							doodadManager.create(type, x, y, z);
						}

						break;
					}
					case "corpse": {
						if (data.corpse!.replaceExisting || data.corpse!.type === "remove") {
							const corpses = game.getTile(x, y, z).corpses;
							if (corpses) {
								for (const corpse of corpses) {
									corpseManager.remove(corpse);
								}
							}
						}

						const type = data.corpse!.type;
						if (type !== undefined && type !== "remove") {
							corpseManager.create(type, x, y, z, undefined, data.corpse!.aberrant);
						}

						break;
					}
					case "tileEvent": {
						if (data.tileEvent!.replaceExisting || data.tileEvent!.type === "remove") {
							const tileEvents = game.getTile(x, y, z).events;
							if (tileEvents) {
								for (const event of tileEvents) {
									tileEventManager.remove(event);
								}
							}
						}

						const type = data.tileEvent!.type;
						if (type !== undefined && type !== "remove") {
							tileEventManager.create(type, x, y, z);
						}

						break;
					}
				}
			}
		}
	});
