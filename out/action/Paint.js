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
define(["require", "exports", "game/entity/action/Action", "game/entity/action/IAction", "game/entity/IEntity", "../Actions", "./helpers/SetTilled", "renderer/IRenderer"], function (require, exports, Action_1, IAction_1, IEntity_1, Actions_1, SetTilled_1, IRenderer_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = new Action_1.Action(IAction_1.ActionArgument.TileArray, IAction_1.ActionArgument.Object)
        .setUsableBy(IEntity_1.EntityType.Human)
        .setUsableWhen(...Actions_1.defaultUsability)
        .setHandler((action, tiles, data) => {
        for (const tile of tiles) {
            for (const k of Object.keys(data)) {
                const paintType = k;
                switch (paintType) {
                    case "terrain": {
                        tile.changeTile(data.terrain.type, false);
                        if (data.terrain.tilled !== undefined && data.terrain.tilled !== tile.isTilled) {
                            (0, SetTilled_1.default)(action.executor.island, tile, data.terrain.tilled);
                        }
                        break;
                    }
                    case "creature": {
                        const creature = tile.creature;
                        if (creature)
                            action.executor.island.creatures.remove(creature);
                        const type = data.creature.type;
                        if (type !== "remove") {
                            action.executor.island.creatures.spawn(type, tile, true, data.creature.aberrant, undefined, true);
                        }
                        break;
                    }
                    case "npc": {
                        const npc = tile.npc;
                        if (npc)
                            action.executor.island.npcs.remove(npc);
                        const type = data.npc.type;
                        if (type !== "remove") {
                            action.executor.island.npcs.spawn(type, tile, { allowEdgeSpawning: true, allowOverDooadsAndTileEvents: true, allowOnFire: true, allowOnBlockedTiles: true });
                        }
                        break;
                    }
                    case "doodad": {
                        const doodad = tile.doodad;
                        if (doodad)
                            action.executor.island.doodads.remove(doodad);
                        const type = data.doodad.type;
                        if (type !== "remove") {
                            action.executor.island.doodads.create(type, tile);
                        }
                        break;
                    }
                    case "corpse": {
                        if (data.corpse.replaceExisting || data.corpse.type === "remove") {
                            const corpses = tile.corpses;
                            if (corpses) {
                                for (const corpse of corpses) {
                                    action.executor.island.corpses.remove(corpse);
                                }
                            }
                        }
                        const type = data.corpse.type;
                        if (type !== undefined && type !== "remove") {
                            action.executor.island.corpses.create(type, tile, undefined, data.corpse.aberrant);
                        }
                        break;
                    }
                    case "tileEvent": {
                        if (data.tileEvent.replaceExisting || data.tileEvent.type === "remove") {
                            const tileEvents = tile.events;
                            if (tileEvents) {
                                for (const event of tileEvents) {
                                    action.executor.island.tileEvents.remove(event);
                                }
                            }
                        }
                        const type = data.tileEvent.type;
                        if (type !== undefined && type !== "remove") {
                            action.executor.island.tileEvents.create(type, tile);
                        }
                        break;
                    }
                }
            }
        }
        renderers.updateView(undefined, IRenderer_1.RenderSource.Mod, true);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGFpbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvYWN0aW9uL1BhaW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7R0FTRzs7OztJQWdCSCxrQkFBZSxJQUFJLGVBQU0sQ0FBQyx3QkFBYyxDQUFDLFNBQVMsRUFBRSx3QkFBYyxDQUFDLE1BQU0sQ0FBQztTQUN4RSxXQUFXLENBQUMsb0JBQVUsQ0FBQyxLQUFLLENBQUM7U0FDN0IsYUFBYSxDQUFDLEdBQUcsMEJBQWdCLENBQUM7U0FDbEMsVUFBVSxDQUFDLENBQUMsTUFBTSxFQUFFLEtBQWEsRUFBRSxJQUFnQixFQUFFLEVBQUU7UUFDdkQsS0FBSyxNQUFNLElBQUksSUFBSSxLQUFLLEVBQUU7WUFDekIsS0FBSyxNQUFNLENBQUMsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFO2dCQUNsQyxNQUFNLFNBQVMsR0FBRyxDQUFxQixDQUFDO2dCQUN4QyxRQUFRLFNBQVMsRUFBRTtvQkFDbEIsS0FBSyxTQUFTLENBQUMsQ0FBQzt3QkFDZixJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxPQUFRLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO3dCQUMzQyxJQUFJLElBQUksQ0FBQyxPQUFRLENBQUMsTUFBTSxLQUFLLFNBQVMsSUFBSSxJQUFJLENBQUMsT0FBUSxDQUFDLE1BQU0sS0FBSyxJQUFJLENBQUMsUUFBUSxFQUFFOzRCQUNqRixJQUFBLG1CQUFTLEVBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxPQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7eUJBQzlEO3dCQUNELE1BQU07cUJBQ047b0JBQ0QsS0FBSyxVQUFVLENBQUMsQ0FBQzt3QkFDaEIsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQzt3QkFDL0IsSUFBSSxRQUFROzRCQUFFLE1BQU0sQ0FB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