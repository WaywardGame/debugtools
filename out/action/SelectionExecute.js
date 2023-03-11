define(["require", "exports", "game/entity/action/Action", "game/entity/action/IAction", "game/entity/IEntity", "game/entity/player/Player", "../Actions", "../IDebugTools", "./helpers/Remove", "./helpers/TeleportEntity"], function (require, exports, Action_1, IAction_1, IEntity_1, Player_1, Actions_1, IDebugTools_1, Remove_1, TeleportEntity_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SelectionType = void 0;
    exports.default = new Action_1.Action(IAction_1.ActionArgument.Integer32, IAction_1.ActionArgument.Array, (0, IAction_1.optional)(IAction_1.ActionArgument.String))
        .setUsableBy(IEntity_1.EntityType.Player)
        .setUsableWhen(...Actions_1.defaultUsability)
        .setHandler((action, executionType, selection, alternativeTarget) => {
        for (const [type, id] of selection) {
            const target = getTarget(action.executor.island, type, id);
            if (!target)
                continue;
            switch (executionType) {
                case IDebugTools_1.DebugToolsTranslation.ActionRemove:
                    if (target instanceof Player_1.default)
                        continue;
                    (0, Remove_1.default)(action, target);
                    break;
                case IDebugTools_1.DebugToolsTranslation.ActionTeleport:
                    const playerToTeleport = game.playerManager.getAll(true, true).find(player => player.identifier === alternativeTarget);
                    if (playerToTeleport) {
                        (0, TeleportEntity_1.teleportEntity)(action, playerToTeleport, target);
                    }
                    return;
            }
        }
        renderers.computeSpritesInViewport(action.executor);
        action.setUpdateRender();
    });
    function getTarget(island, type, id) {
        switch (type) {
            case SelectionType.Creature: return island.creatures.get(id);
            case SelectionType.NPC: return island.npcs.get(id);
            case SelectionType.TileEvent: return island.tileEvents.get(id);
            case SelectionType.Doodad: return island.doodads.get(id);
            case SelectionType.Corpse: return island.corpses.get(id);
            case SelectionType.Player: return game.playerManager.getAll(true, true).find(player => player.identifier === id);
        }
    }
    var SelectionType;
    (function (SelectionType) {
        SelectionType[SelectionType["Creature"] = 0] = "Creature";
        SelectionType[SelectionType["NPC"] = 1] = "NPC";
        SelectionType[SelectionType["TileEvent"] = 2] = "TileEvent";
        SelectionType[SelectionType["Doodad"] = 3] = "Doodad";
        SelectionType[SelectionType["Corpse"] = 4] = "Corpse";
        SelectionType[SelectionType["Player"] = 5] = "Player";
    })(SelectionType = exports.SelectionType || (exports.SelectionType = {}));
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2VsZWN0aW9uRXhlY3V0ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hY3Rpb24vU2VsZWN0aW9uRXhlY3V0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0lBZUEsa0JBQWUsSUFBSSxlQUFNLENBQUMsd0JBQWMsQ0FBQyxTQUFTLEVBQUUsd0JBQWMsQ0FBQyxLQUFLLEVBQUUsSUFBQSxrQkFBUSxFQUFDLHdCQUFjLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDeEcsV0FBVyxDQUFDLG9CQUFVLENBQUMsTUFBTSxDQUFDO1NBQzlCLGFBQWEsQ0FBQyxHQUFHLDBCQUFnQixDQUFDO1NBQ2xDLFVBQVUsQ0FBQyxDQUFDLE1BQU0sRUFBRSxhQUFvQyxFQUFFLFNBQW9DLEVBQUUsaUJBQWlCLEVBQUUsRUFBRTtRQUNySCxLQUFLLE1BQU0sQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLElBQUksU0FBUyxFQUFFO1lBQ25DLE1BQU0sTUFBTSxHQUFHLFNBQVMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDM0QsSUFBSSxDQUFDLE1BQU07Z0JBQUUsU0FBUztZQUV0QixRQUFRLGFBQWEsRUFBRTtnQkFDdEIsS0FBSyxtQ0FBcUIsQ0FBQyxZQUFZO29CQUN0QyxJQUFJLE1BQU0sWUFBWSxnQkFBTTt3QkFBRSxTQUFTO29CQUN2QyxJQUFBLGdCQUFNLEVBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDO29CQUN2QixNQUFNO2dCQUNQLEtBQUssbUNBQXFCLENBQUMsY0FBYztvQkFDeEMsTUFBTSxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLFVBQVUsS0FBSyxpQkFBaUIsQ0FBQyxDQUFDO29CQUN2SCxJQUFJLGdCQUFnQixFQUFFO3dCQUNyQixJQUFBLCtCQUFjLEVBQUMsTUFBTSxFQUFFLGdCQUFnQixFQUFFLE1BQU0sQ0FBQyxDQUFDO3FCQUNqRDtvQkFDRCxPQUFPO2FBQ1I7U0FDRDtRQUVELFNBQVMsQ0FBQyx3QkFBd0IsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDcEQsTUFBTSxDQUFDLGVBQWUsRUFBRSxDQUFDO0lBQzFCLENBQUMsQ0FBQyxDQUFDO0lBRUosU0FBUyxTQUFTLENBQUMsTUFBYyxFQUFFLElBQW1CLEVBQUUsRUFBbUI7UUFDMUUsUUFBUSxJQUFJLEVBQUU7WUFDYixLQUFLLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxPQUFPLE1BQU0sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEVBQVksQ0FBQyxDQUFDO1lBQ3ZFLEtBQUssYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBWSxDQUFDLENBQUM7WUFDN0QsS0FBSyxhQUFhLENBQUMsU0FBUyxDQUFDLENBQUMsT0FBTyxNQUFNLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxFQUFZLENBQUMsQ0FBQztZQUN6RSxLQUFLLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQVksQ0FBQyxDQUFDO1lBQ25FLEtBQUssYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBWSxDQUFDLENBQUM7WUFDbkUsS0FBSyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLFVBQVUsS0FBSyxFQUFFLENBQUMsQ0FBQztTQUNqSDtJQUNGLENBQUM7SUFFRCxJQUFZLGFBT1g7SUFQRCxXQUFZLGFBQWE7UUFDeEIseURBQVEsQ0FBQTtRQUNSLCtDQUFHLENBQUE7UUFDSCwyREFBUyxDQUFBO1FBQ1QscURBQU0sQ0FBQTtRQUNOLHFEQUFNLENBQUE7UUFDTixxREFBTSxDQUFBO0lBQ1AsQ0FBQyxFQVBXLGFBQWEsR0FBYixxQkFBYSxLQUFiLHFCQUFhLFFBT3hCIn0=