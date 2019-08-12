define(["require", "exports", "entity/action/Action", "entity/action/IAction", "entity/IEntity", "entity/player/Player", "../Actions", "../IDebugTools", "./helpers/Remove", "./helpers/TeleportEntity"], function (require, exports, Action_1, IAction_1, IEntity_1, Player_1, Actions_1, IDebugTools_1, Remove_1, TeleportEntity_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = new Action_1.Action(IAction_1.ActionArgument.Number, IAction_1.ActionArgument.Array, IAction_1.optional(IAction_1.ActionArgument.String))
        .setUsableBy(IEntity_1.EntityType.Player)
        .setUsableWhen(...Actions_1.defaultUsability)
        .setHandler((action, executionType, selection, alternativeTarget) => {
        for (const [type, id] of selection) {
            const target = getTarget(type, id);
            if (!target)
                continue;
            switch (executionType) {
                case IDebugTools_1.DebugToolsTranslation.ActionRemove:
                    if (target instanceof Player_1.default)
                        continue;
                    Remove_1.default(action, target);
                    break;
                case IDebugTools_1.DebugToolsTranslation.ActionTeleportTo:
                    const playerToTeleport = players.find(player => player.identifier === alternativeTarget) || localPlayer;
                    TeleportEntity_1.teleportEntity(action, playerToTeleport, target);
                    return;
            }
        }
        renderer.computeSpritesInViewport();
        action.setUpdateRender();
    });
    function getTarget(type, id) {
        switch (type) {
            case SelectionType.Creature: return game.creatures[id];
            case SelectionType.NPC: return game.npcs[id];
            case SelectionType.TileEvent: return game.tileEvents[id];
            case SelectionType.Doodad: return game.doodads[id];
            case SelectionType.Corpse: return game.corpses[id];
            case SelectionType.Player: return players.find(player => player.identifier === id);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2VsZWN0aW9uRXhlY3V0ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hY3Rpb24vU2VsZWN0aW9uRXhlY3V0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7SUFjQSxrQkFBZSxJQUFJLGVBQU0sQ0FBQyx3QkFBYyxDQUFDLE1BQU0sRUFBRSx3QkFBYyxDQUFDLEtBQUssRUFBRSxrQkFBUSxDQUFDLHdCQUFjLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDckcsV0FBVyxDQUFDLG9CQUFVLENBQUMsTUFBTSxDQUFDO1NBQzlCLGFBQWEsQ0FBQyxHQUFHLDBCQUFnQixDQUFDO1NBQ2xDLFVBQVUsQ0FBQyxDQUFDLE1BQU0sRUFBRSxhQUFvQyxFQUFFLFNBQW9DLEVBQUUsaUJBQWlCLEVBQUUsRUFBRTtRQUNySCxLQUFLLE1BQU0sQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLElBQUksU0FBUyxFQUFFO1lBQ25DLE1BQU0sTUFBTSxHQUFHLFNBQVMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDbkMsSUFBSSxDQUFDLE1BQU07Z0JBQUUsU0FBUztZQUV0QixRQUFRLGFBQWEsRUFBRTtnQkFDdEIsS0FBSyxtQ0FBcUIsQ0FBQyxZQUFZO29CQUN0QyxJQUFJLE1BQU0sWUFBWSxnQkFBTTt3QkFBRSxTQUFTO29CQUN2QyxnQkFBTSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztvQkFDdkIsTUFBTTtnQkFDUCxLQUFLLG1DQUFxQixDQUFDLGdCQUFnQjtvQkFDMUMsTUFBTSxnQkFBZ0IsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLFVBQVUsS0FBSyxpQkFBaUIsQ0FBQyxJQUFJLFdBQVcsQ0FBQztvQkFDeEcsK0JBQWMsQ0FBQyxNQUFNLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxDQUFDLENBQUM7b0JBQ2pELE9BQU87YUFDUjtTQUNEO1FBRUQsUUFBUSxDQUFDLHdCQUF3QixFQUFFLENBQUM7UUFDcEMsTUFBTSxDQUFDLGVBQWUsRUFBRSxDQUFDO0lBQzFCLENBQUMsQ0FBQyxDQUFDO0lBRUosU0FBUyxTQUFTLENBQUMsSUFBbUIsRUFBRSxFQUFtQjtRQUMxRCxRQUFRLElBQUksRUFBRTtZQUNiLEtBQUssYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFZLENBQUMsQ0FBQztZQUNqRSxLQUFLLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBWSxDQUFDLENBQUM7WUFDdkQsS0FBSyxhQUFhLENBQUMsU0FBUyxDQUFDLENBQUMsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLEVBQVksQ0FBQyxDQUFDO1lBQ25FLEtBQUssYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFZLENBQUMsQ0FBQztZQUM3RCxLQUFLLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBWSxDQUFDLENBQUM7WUFDN0QsS0FBSyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLFVBQVUsS0FBSyxFQUFFLENBQUMsQ0FBQztTQUNuRjtJQUNGLENBQUM7SUFFRCxJQUFZLGFBT1g7SUFQRCxXQUFZLGFBQWE7UUFDeEIseURBQVEsQ0FBQTtRQUNSLCtDQUFHLENBQUE7UUFDSCwyREFBUyxDQUFBO1FBQ1QscURBQU0sQ0FBQTtRQUNOLHFEQUFNLENBQUE7UUFDTixxREFBTSxDQUFBO0lBQ1AsQ0FBQyxFQVBXLGFBQWEsR0FBYixxQkFBYSxLQUFiLHFCQUFhLFFBT3hCIn0=