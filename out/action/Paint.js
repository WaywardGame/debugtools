define(["require", "exports", "entity/action/Action", "entity/action/IAction", "entity/IEntity", "../Actions", "../util/TilePosition", "./helpers/SetTilled"], function (require, exports, Action_1, IAction_1, IEntity_1, Actions_1, TilePosition_1, SetTilled_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = new Action_1.Action(IAction_1.ActionArgument.Array, IAction_1.ActionArgument.Object)
        .setUsableBy(IEntity_1.EntityType.Player)
        .setUsableWhen(...Actions_1.defaultUsability)
        .setHandler((action, tiles, data) => {
        for (const tileId of tiles) {
            const [x, y, z] = TilePosition_1.getTilePosition(tileId);
            for (const k in data) {
                const paintType = k;
                switch (paintType) {
                    case "terrain": {
                        game.changeTile(data.terrain.type, x, y, z, false);
                        if (data.terrain.tilled !== undefined)
                            SetTilled_1.default(x, y, z, data.terrain.tilled);
                        break;
                    }
                    case "creature": {
                        const creature = game.getTile(x, y, z).creature;
                        if (creature)
                            creatureManager.remove(creature);
                        const type = data.creature.type;
                        if (type !== "remove") {
                            creatureManager.spawn(type, x, y, z, true, data.creature.aberrant, undefined, true);
                        }
                        break;
                    }
                    case "npc": {
                        const npc = game.getTile(x, y, z).npc;
                        if (npc)
                            npcManager.remove(npc);
                        const type = data.npc.type;
                        if (type !== "remove") {
                            npcManager.spawn(type, x, y, z);
                        }
                        break;
                    }
                    case "doodad": {
                        const doodad = game.getTile(x, y, z).doodad;
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
                            const corpses = game.getTile(x, y, z).corpses;
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
                            const tileEvents = game.getTile(x, y, z).events;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGFpbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvYWN0aW9uL1BhaW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztJQWNBLGtCQUFlLElBQUksZUFBTSxDQUFDLHdCQUFjLENBQUMsS0FBSyxFQUFFLHdCQUFjLENBQUMsTUFBTSxDQUFDO1NBQ3BFLFdBQVcsQ0FBQyxvQkFBVSxDQUFDLE1BQU0sQ0FBQztTQUM5QixhQUFhLENBQUMsR0FBRywwQkFBZ0IsQ0FBQztTQUNsQyxVQUFVLENBQUMsQ0FBQyxNQUFNLEVBQUUsS0FBZSxFQUFFLElBQWdCLEVBQUUsRUFBRTtRQUV6RCxLQUFLLE1BQU0sTUFBTSxJQUFJLEtBQUssRUFBRTtZQUMzQixNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyw4QkFBZSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBRTFDLEtBQUssTUFBTSxDQUFDLElBQUksSUFBSSxFQUFFO2dCQUNyQixNQUFNLFNBQVMsR0FBRyxDQUFxQixDQUFDO2dCQUN4QyxRQUFRLFNBQVMsRUFBRTtvQkFDbEIsS0FBSyxTQUFTLENBQUMsQ0FBQzt3QkFDZixJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxPQUFRLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO3dCQUNwRCxJQUFJLElBQUksQ0FBQyxPQUFRLENBQUMsTUFBTSxLQUFLLFNBQVM7NEJBQUUsbUJBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsT0FBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO3dCQUNqRixNQUFNO3FCQUNOO29CQUNELEtBQUssVUFBVSxDQUFDLENBQUM7d0JBQ2hCLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUM7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