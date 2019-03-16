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
                            creatureManager.spawn(type, x, y, z, true, data.creature.aberrant);
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