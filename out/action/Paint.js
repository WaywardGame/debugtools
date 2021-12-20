define(["require", "exports", "game/entity/action/Action", "game/entity/action/IAction", "game/entity/IEntity", "utilities/game/TileHelpers", "../Actions", "../util/TilePosition", "./helpers/SetTilled"], function (require, exports, Action_1, IAction_1, IEntity_1, TileHelpers_1, Actions_1, TilePosition_1, SetTilled_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = new Action_1.Action(IAction_1.ActionArgument.Array, IAction_1.ActionArgument.Object)
        .setUsableBy(IEntity_1.EntityType.Player)
        .setUsableWhen(...Actions_1.defaultUsability)
        .setHandler((action, tiles, data) => {
        for (const tileId of tiles) {
            const [x, y, z] = (0, TilePosition_1.getTilePosition)(tileId);
            const tile = action.executor.island.getTile(x, y, z);
            for (const k of Object.keys(data)) {
                const paintType = k;
                switch (paintType) {
                    case "terrain": {
                        action.executor.island.changeTile(data.terrain.type, x, y, z, false);
                        if (data.terrain.tilled !== undefined && data.terrain.tilled !== TileHelpers_1.default.isTilled(tile))
                            (0, SetTilled_1.default)(action.executor.island, x, y, z, data.terrain.tilled);
                        break;
                    }
                    case "creature": {
                        const creature = tile.creature;
                        if (creature)
                            action.executor.island.creatures.remove(creature);
                        const type = data.creature.type;
                        if (type !== "remove") {
                            action.executor.island.creatures.spawn(type, x, y, z, true, data.creature.aberrant, undefined, true);
                        }
                        break;
                    }
                    case "npc": {
                        const npc = tile.npc;
                        if (npc)
                            action.executor.island.npcs.remove(npc);
                        const type = data.npc.type;
                        if (type !== "remove") {
                            action.executor.island.npcs.spawn(type, x, y, z);
                        }
                        break;
                    }
                    case "doodad": {
                        const doodad = tile.doodad;
                        if (doodad)
                            action.executor.island.doodads.remove(doodad);
                        const type = data.doodad.type;
                        if (type !== "remove") {
                            action.executor.island.doodads.create(type, x, y, z);
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
                            action.executor.island.corpses.create(type, x, y, z, undefined, data.corpse.aberrant);
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
                            action.executor.island.tileEvents.create(type, x, y, z);
                        }
                        break;
                    }
                }
            }
        }
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGFpbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvYWN0aW9uL1BhaW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztJQWVBLGtCQUFlLElBQUksZUFBTSxDQUFDLHdCQUFjLENBQUMsS0FBSyxFQUFFLHdCQUFjLENBQUMsTUFBTSxDQUFDO1NBQ3BFLFdBQVcsQ0FBQyxvQkFBVSxDQUFDLE1BQU0sQ0FBQztTQUM5QixhQUFhLENBQUMsR0FBRywwQkFBZ0IsQ0FBQztTQUNsQyxVQUFVLENBQUMsQ0FBQyxNQUFNLEVBQUUsS0FBZSxFQUFFLElBQWdCLEVBQUUsRUFBRTtRQUV6RCxLQUFLLE1BQU0sTUFBTSxJQUFJLEtBQUssRUFBRTtZQUMzQixNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxJQUFBLDhCQUFlLEVBQUMsTUFBTSxDQUFDLENBQUM7WUFDMUMsTUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDckQsS0FBSyxNQUFNLENBQUMsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFO2dCQUNsQyxNQUFNLFNBQVMsR0FBRyxDQUFxQixDQUFDO2dCQUN4QyxRQUFRLFNBQVMsRUFBRTtvQkFDbEIsS0FBSyxTQUFTLENBQUMsQ0FBQzt3QkFDZixNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLE9BQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7d0JBQ3RFLElBQUksSUFBSSxDQUFDLE9BQVEsQ0FBQyxNQUFNLEtBQUssU0FBUyxJQUFJLElBQUksQ0FBQyxPQUFRLENBQUMsTUFBTSxLQUFLLHFCQUFXLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQzs0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