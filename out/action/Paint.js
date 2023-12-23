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
define(["require", "exports", "@wayward/game/game/entity/action/Action", "@wayward/game/game/entity/action/IAction", "@wayward/game/game/entity/IEntity", "../Actions", "./helpers/SetTilled", "@wayward/game/renderer/IRenderer"], function (require, exports, Action_1, IAction_1, IEntity_1, Actions_1, SetTilled_1, IRenderer_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = new Action_1.Action(IAction_1.ActionArgument.TileArray, IAction_1.ActionArgument.Object)
        .setUsableBy(IEntity_1.EntityType.Human)
        .setUsableWhen(...Actions_1.defaultUsability)
        .setCanUse(Actions_1.defaultCanUseHandler)
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
                            action.executor.island.npcs.create(type, tile, { allowEdgeSpawning: true, allowOverDooadsAndTileEvents: true, allowOnFire: true, allowOnBlockedTiles: true });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGFpbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvYWN0aW9uL1BhaW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7R0FTRzs7OztJQWdCSCxrQkFBZSxJQUFJLGVBQU0sQ0FBQyx3QkFBYyxDQUFDLFNBQVMsRUFBRSx3QkFBYyxDQUFDLE1BQU0sQ0FBQztTQUN4RSxXQUFXLENBQUMsb0JBQVUsQ0FBQyxLQUFLLENBQUM7U0FDN0IsYUFBYSxDQUFDLEdBQUcsMEJBQWdCLENBQUM7U0FDbEMsU0FBUyxDQUFDLDhCQUFvQixDQUFDO1NBQy9CLFVBQVUsQ0FBQyxDQUFDLE1BQU0sRUFBRSxLQUFhLEVBQUUsSUFBZ0IsRUFBRSxFQUFFO1FBQ3ZELEtBQUssTUFBTSxJQUFJLElBQUksS0FBSyxFQUFFLENBQUM7WUFDMUIsS0FBSyxNQUFNLENBQUMsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUM7Z0JBQ25DLE1BQU0sU0FBUyxHQUFHLENBQXFCLENBQUM7Z0JBQ3hDLFFBQVEsU0FBUyxFQUFFLENBQUM7b0JBQ25CLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQzt3QkFDaEIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsT0FBUSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQzt3QkFDM0MsSUFBSSxJQUFJLENBQUMsT0FBUSxDQUFDLE1BQU0sS0FBSyxTQUFTLElBQUksSUFBSSxDQUFDLE9BQVEsQ0FBQyxNQUFNLEtBQUssSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDOzRCQUNsRixJQUFBLG1CQUFTLEVBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxPQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7d0JBQy9ELENBQUM7d0JBQ0QsTUFBTTtvQkFDUCxDQUFDO29CQUNELEtBQUssVUFBVSxDQUFDLENBQUMsQ0FBQzt3QkFD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