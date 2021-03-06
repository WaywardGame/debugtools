define(["require", "exports", "game/entity/action/Action", "game/entity/action/IAction", "game/entity/IEntity", "game/entity/player/Player", "../Actions", "../IDebugTools", "./helpers/Remove", "./helpers/TeleportEntity"], function (require, exports, Action_1, IAction_1, IEntity_1, Player_1, Actions_1, IDebugTools_1, Remove_1, TeleportEntity_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SelectionType = void 0;
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
                    const playerToTeleport = players.find(player => player.identifier === alternativeTarget);
                    if (playerToTeleport) {
                        TeleportEntity_1.teleportEntity(action, playerToTeleport, target);
                    }
                    return;
            }
        }
        renderer === null || renderer === void 0 ? void 0 : renderer.computeSpritesInViewport();
        action.setUpdateRender();
    });
    function getTarget(type, id) {
        switch (type) {
            case SelectionType.Creature: return island.creatures[id];
            case SelectionType.NPC: return island.npcs[id];
            case SelectionType.TileEvent: return island.tileEvents[id];
            case SelectionType.Doodad: return island.doodads[id];
            case SelectionType.Corpse: return island.corpses[id];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2VsZWN0aW9uRXhlY3V0ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hY3Rpb24vU2VsZWN0aW9uRXhlY3V0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0lBY0Esa0JBQWUsSUFBSSxlQUFNLENBQUMsd0JBQWMsQ0FBQyxNQUFNLEVBQUUsd0JBQWMsQ0FBQyxLQUFLLEVBQUUsa0JBQVEsQ0FBQyx3QkFBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQ3JHLFdBQVcsQ0FBQyxvQkFBVSxDQUFDLE1BQU0sQ0FBQztTQUM5QixhQUFhLENBQUMsR0FBRywwQkFBZ0IsQ0FBQztTQUNsQyxVQUFVLENBQUMsQ0FBQyxNQUFNLEVBQUUsYUFBb0MsRUFBRSxTQUFvQyxFQUFFLGlCQUFpQixFQUFFLEVBQUU7UUFDckgsS0FBSyxNQUFNLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxJQUFJLFNBQVMsRUFBRTtZQUNuQyxNQUFNLE1BQU0sR0FBRyxTQUFTLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQ25DLElBQUksQ0FBQyxNQUFNO2dCQUFFLFNBQVM7WUFFdEIsUUFBUSxhQUFhLEVBQUU7Z0JBQ3RCLEtBQUssbUNBQXFCLENBQUMsWUFBWTtvQkFDdEMsSUFBSSxNQUFNLFlBQVksZ0JBQU07d0JBQUUsU0FBUztvQkFDdkMsZ0JBQU0sQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUM7b0JBQ3ZCLE1BQU07Z0JBQ1AsS0FBSyxtQ0FBcUIsQ0FBQyxjQUFjO29CQUN4QyxNQUFNLGdCQUFnQixHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsVUFBVSxLQUFLLGlCQUFpQixDQUFDLENBQUM7b0JBQ3pGLElBQUksZ0JBQWdCLEVBQUU7d0JBQ3JCLCtCQUFjLENBQUMsTUFBTSxFQUFFLGdCQUFnQixFQUFFLE1BQU0sQ0FBQyxDQUFDO3FCQUNqRDtvQkFDRCxPQUFPO2FBQ1I7U0FDRDtRQUVELFFBQVEsYUFBUixRQUFRLHVCQUFSLFFBQVEsQ0FBRSx3QkFBd0IsRUFBRSxDQUFDO1FBQ3JDLE1BQU0sQ0FBQyxlQUFlLEVBQUUsQ0FBQztJQUMxQixDQUFDLENBQUMsQ0FBQztJQUVKLFNBQVMsU0FBUyxDQUFDLElBQW1CLEVBQUUsRUFBbUI7UUFDMUQsUUFBUSxJQUFJLEVBQUU7WUFDYixLQUFLLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxPQUFPLE1BQU0sQ0FBQyxTQUFTLENBQUMsRUFBWSxDQUFDLENBQUM7WUFDbkUsS0FBSyxhQUFhLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQVksQ0FBQyxDQUFDO1lBQ3pELEtBQUssYUFBYSxDQUFDLFNBQVMsQ0FBQyxDQUFDLE9BQU8sTUFBTSxDQUFDLFVBQVUsQ0FBQyxFQUFZLENBQUMsQ0FBQztZQUNyRSxLQUFLLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLE1BQU0sQ0FBQyxPQUFPLENBQUMsRUFBWSxDQUFDLENBQUM7WUFDL0QsS0FBSyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxNQUFNLENBQUMsT0FBTyxDQUFDLEVBQVksQ0FBQyxDQUFDO1lBQy9ELEtBQUssYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxVQUFVLEtBQUssRUFBRSxDQUFDLENBQUM7U0FDbkY7SUFDRixDQUFDO0lBRUQsSUFBWSxhQU9YO0lBUEQsV0FBWSxhQUFhO1FBQ3hCLHlEQUFRLENBQUE7UUFDUiwrQ0FBRyxDQUFBO1FBQ0gsMkRBQVMsQ0FBQTtRQUNULHFEQUFNLENBQUE7UUFDTixxREFBTSxDQUFBO1FBQ04scURBQU0sQ0FBQTtJQUNQLENBQUMsRUFQVyxhQUFhLEdBQWIscUJBQWEsS0FBYixxQkFBYSxRQU94QiJ9