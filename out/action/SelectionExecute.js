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
                case IDebugTools_1.DebugToolsTranslation.ActionTeleport:
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2VsZWN0aW9uRXhlY3V0ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hY3Rpb24vU2VsZWN0aW9uRXhlY3V0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7SUFjQSxrQkFBZSxJQUFJLGVBQU0sQ0FBQyx3QkFBYyxDQUFDLE1BQU0sRUFBRSx3QkFBYyxDQUFDLEtBQUssRUFBRSxrQkFBUSxDQUFDLHdCQUFjLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDckcsV0FBVyxDQUFDLG9CQUFVLENBQUMsTUFBTSxDQUFDO1NBQzlCLGFBQWEsQ0FBQyxHQUFHLDBCQUFnQixDQUFDO1NBQ2xDLFVBQVUsQ0FBQyxDQUFDLE1BQU0sRUFBRSxhQUFvQyxFQUFFLFNBQW9DLEVBQUUsaUJBQWlCLEVBQUUsRUFBRTtRQUNySCxLQUFLLE1BQU0sQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLElBQUksU0FBUyxFQUFFO1lBQ25DLE1BQU0sTUFBTSxHQUFHLFNBQVMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDbkMsSUFBSSxDQUFDLE1BQU07Z0JBQUUsU0FBUztZQUV0QixRQUFRLGFBQWEsRUFBRTtnQkFDdEIsS0FBSyxtQ0FBcUIsQ0FBQyxZQUFZO29CQUN0QyxJQUFJLE1BQU0sWUFBWSxnQkFBTTt3QkFBRSxTQUFTO29CQUN2QyxnQkFBTSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztvQkFDdkIsTUFBTTtnQkFDUCxLQUFLLG1DQUFxQixDQUFDLGNBQWM7b0JBQ3hDLE1BQU0sZ0JBQWdCLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxVQUFVLEtBQUssaUJBQWlCLENBQUMsSUFBSSxXQUFXLENBQUM7b0JBQ3hHLCtCQUFjLENBQUMsTUFBTSxFQUFFLGdCQUFnQixFQUFFLE1BQU0sQ0FBQyxDQUFDO29CQUNqRCxPQUFPO2FBQ1I7U0FDRDtRQUVELFFBQVEsQ0FBQyx3QkFBd0IsRUFBRSxDQUFDO1FBQ3BDLE1BQU0sQ0FBQyxlQUFlLEVBQUUsQ0FBQztJQUMxQixDQUFDLENBQUMsQ0FBQztJQUVKLFNBQVMsU0FBUyxDQUFDLElBQW1CLEVBQUUsRUFBbUI7UUFDMUQsUUFBUSxJQUFJLEVBQUU7WUFDYixLQUFLLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBWSxDQUFDLENBQUM7WUFDakUsS0FBSyxhQUFhLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQVksQ0FBQyxDQUFDO1lBQ3ZELEtBQUssYUFBYSxDQUFDLFNBQVMsQ0FBQyxDQUFDLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxFQUFZLENBQUMsQ0FBQztZQUNuRSxLQUFLLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBWSxDQUFDLENBQUM7WUFDN0QsS0FBSyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQVksQ0FBQyxDQUFDO1lBQzdELEtBQUssYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxVQUFVLEtBQUssRUFBRSxDQUFDLENBQUM7U0FDbkY7SUFDRixDQUFDO0lBRUQsSUFBWSxhQU9YO0lBUEQsV0FBWSxhQUFhO1FBQ3hCLHlEQUFRLENBQUE7UUFDUiwrQ0FBRyxDQUFBO1FBQ0gsMkRBQVMsQ0FBQTtRQUNULHFEQUFNLENBQUE7UUFDTixxREFBTSxDQUFBO1FBQ04scURBQU0sQ0FBQTtJQUNQLENBQUMsRUFQVyxhQUFhLEdBQWIscUJBQWEsS0FBYixxQkFBYSxRQU94QiJ9