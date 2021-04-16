define(["require", "exports", "game/entity/action/Action", "game/entity/action/IAction", "game/entity/IEntity", "utilities/game/TileHelpers", "../Actions", "../util/TilePosition", "./helpers/SetTilled"], function (require, exports, Action_1, IAction_1, IEntity_1, TileHelpers_1, Actions_1, TilePosition_1, SetTilled_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = new Action_1.Action(IAction_1.ActionArgument.Array, IAction_1.ActionArgument.Object)
        .setUsableBy(IEntity_1.EntityType.Player)
        .setUsableWhen(...Actions_1.defaultUsability)
        .setHandler((action, tiles, data) => {
        for (const tileId of tiles) {
            const [x, y, z] = TilePosition_1.getTilePosition(tileId);
            const tile = game.getTile(x, y, z);
            for (const k of Object.keys(data)) {
                const paintType = k;
                switch (paintType) {
                    case "terrain": {
                        game.changeTile(data.terrain.type, x, y, z, false);
                        if (data.terrain.tilled !== undefined && data.terrain.tilled !== TileHelpers_1.default.isTilled(tile))
                            SetTilled_1.default(x, y, z, data.terrain.tilled);
                        break;
                    }
                    case "creature": {
                        const creature = tile.creature;
                        if (creature)
                            creatureManager.remove(creature);
                        const type = data.creature.type;
                        if (type !== "remove") {
                            creatureManager.spawn(type, x, y, z, true, data.creature.aberrant, undefined, true);
                        }
                        break;
                    }
                    case "npc": {
                        const npc = tile.npc;
                        if (npc)
                            npcManager.remove(npc);
                        const type = data.npc.type;
                        if (type !== "remove") {
                            npcManager.spawn(type, x, y, z);
                        }
                        break;
                    }
                    case "doodad": {
                        const doodad = tile.doodad;
                        if (doodad)
                            doodadManager.remove(doodad);
                        const type = data.doodad.type;
                        if (type !== "remove") {
                            doodadManager.create(type, x, y, z);
                        }
                        break;
                    }
                    case "corpse": {
                        if (data.corpse.replaceExisting || data.corpse.type === "remove") {
                            const corpses = tile.corpses;
                            if (corpses) {
                                for (const corpse of corpses) {
                                    corpseManager.remove(corpse);
                                }
                            }
                        }
                        const type = data.corpse.type;
                        if (type !== undefined && type !== "remove") {
                            corpseManager.create(type, x, y, z, undefined, data.corpse.aberrant);
                        }
                        break;
                    }
                    case "tileEvent": {
                        if (data.tileEvent.replaceExisting || data.tileEvent.type === "remove") {
                            const tileEvents = tile.events;
                            if (tileEvents) {
                                for (const event of tileEvents) {
                                    tileEventManager.remove(event);
                                }
                            }
                        }
                        const type = data.tileEvent.type;
                        if (type !== undefined && type !== "remove") {
                            tileEventManager.create(type, x, y, z);
                        }
                        break;
                    }
                }
            }
        }
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGFpbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvYWN0aW9uL1BhaW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztJQWVBLGtCQUFlLElBQUksZUFBTSxDQUFDLHdCQUFjLENBQUMsS0FBSyxFQUFFLHdCQUFjLENBQUMsTUFBTSxDQUFDO1NBQ3BFLFdBQVcsQ0FBQyxvQkFBVSxDQUFDLE1BQU0sQ0FBQztTQUM5QixhQUFhLENBQUMsR0FBRywwQkFBZ0IsQ0FBQztTQUNsQyxVQUFVLENBQUMsQ0FBQyxNQUFNLEVBQUUsS0FBZSxFQUFFLElBQWdCLEVBQUUsRUFBRTtRQUV6RCxLQUFLLE1BQU0sTUFBTSxJQUFJLEtBQUssRUFBRTtZQUMzQixNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyw4QkFBZSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQzFDLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUNuQyxLQUFLLE1BQU0sQ0FBQyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0JBQ2xDLE1BQU0sU0FBUyxHQUFHLENBQXFCLENBQUM7Z0JBQ3hDLFFBQVEsU0FBUyxFQUFFO29CQUNsQixLQUFLLFNBQVMsQ0FBQyxDQUFDO3dCQUNmLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLE9BQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7d0JBQ3BELElBQUksSUFBSSxDQUFDLE9BQVEsQ0FBQyxNQUFNLEtBQUssU0FBUyxJQUFJLElBQUksQ0FBQyxPQUFRLENBQUMsTUFBTSxLQUFLLHFCQUFXLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQzs0QkFDNUYsbUJBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFB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