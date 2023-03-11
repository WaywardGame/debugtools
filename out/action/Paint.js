define(["require", "exports", "game/entity/action/Action", "game/entity/action/IAction", "game/entity/IEntity", "../Actions", "./helpers/SetTilled", "renderer/IRenderer"], function (require, exports, Action_1, IAction_1, IEntity_1, Actions_1, SetTilled_1, IRenderer_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = new Action_1.Action(IAction_1.ActionArgument.TileArray, IAction_1.ActionArgument.Object)
        .setUsableBy(IEntity_1.EntityType.Player)
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGFpbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvYWN0aW9uL1BhaW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztJQWNBLGtCQUFlLElBQUksZUFBTSxDQUFDLHdCQUFjLENBQUMsU0FBUyxFQUFFLHdCQUFjLENBQUMsTUFBTSxDQUFDO1NBQ3hFLFdBQVcsQ0FBQyxvQkFBVSxDQUFDLE1BQU0sQ0FBQztTQUM5QixhQUFhLENBQUMsR0FBRywwQkFBZ0IsQ0FBQztTQUNsQyxVQUFVLENBQUMsQ0FBQyxNQUFNLEVBQUUsS0FBYSxFQUFFLElBQWdCLEVBQUUsRUFBRTtRQUN2RCxLQUFLLE1BQU0sSUFBSSxJQUFJLEtBQUssRUFBRTtZQUN6QixLQUFLLE1BQU0sQ0FBQyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0JBQ2xDLE1BQU0sU0FBUyxHQUFHLENBQXFCLENBQUM7Z0JBQ3hDLFFBQVEsU0FBUyxFQUFFO29CQUNsQixLQUFLLFNBQVMsQ0FBQyxDQUFDO3dCQUNmLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLE9BQVEsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7d0JBQzNDLElBQUksSUFBSSxDQUFDLE9BQVEsQ0FBQyxNQUFNLEtBQUssU0FBUyxJQUFJLElBQUksQ0FBQyxPQUFRLENBQUMsTUFBTSxLQUFLLElBQUksQ0FBQyxRQUFRLEVBQUU7NEJBQ2pGLElBQUEsbUJBQVMsRUFBQyxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLE9BQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQzt5QkFDOUQ7d0JBQ0QsTUFBTTtxQkFDTjtvQkFDRCxLQUFLLFVBQVUsQ0FBQyxDQUFDO3dCQUNoQixNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO3dCQUMvQixJQUFJLFFBQVE7NEJBQUUsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENB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