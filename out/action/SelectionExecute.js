define(["require", "exports", "entity/action/Action", "entity/action/IAction", "entity/IEntity", "entity/player/Player", "../Actions", "../IDebugTools", "./helpers/Remove", "./helpers/TeleportEntity"], function (require, exports, Action_1, IAction_1, IEntity_1, Player_1, Actions_1, IDebugTools_1, Remove_1, TeleportEntity_1) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2VsZWN0aW9uRXhlY3V0ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hY3Rpb24vU2VsZWN0aW9uRXhlY3V0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0lBY0Esa0JBQWUsSUFBSSxlQUFNLENBQUMsd0JBQWMsQ0FBQyxNQUFNLEVBQUUsd0JBQWMsQ0FBQyxLQUFLLEVBQUUsa0JBQVEsQ0FBQyx3QkFBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQ3JHLFdBQVcsQ0FBQyxvQkFBVSxDQUFDLE1BQU0sQ0FBQztTQUM5QixhQUFhLENBQUMsR0FBRywwQkFBZ0IsQ0FBQztTQUNsQyxVQUFVLENBQUMsQ0FBQyxNQUFNLEVBQUUsYUFBb0MsRUFBRSxTQUFvQyxFQUFFLGlCQUFpQixFQUFFLEVBQUU7UUFDckgsS0FBSyxNQUFNLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxJQUFJLFNBQVMsRUFBRTtZQUNuQyxNQUFNLE1BQU0sR0FBRyxTQUFTLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQ25DLElBQUksQ0FBQyxNQUFNO2dCQUFFLFNBQVM7WUFFdEIsUUFBUSxhQUFhLEVBQUU7Z0JBQ3RCLEtBQUssbUNBQXFCLENBQUMsWUFBWTtvQkFDdEMsSUFBSSxNQUFNLFlBQVksZ0JBQU07d0JBQUUsU0FBUztvQkFDdkMsZ0JBQU0sQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUM7b0JBQ3ZCLE1BQU07Z0JBQ1AsS0FBSyxtQ0FBcUIsQ0FBQyxjQUFjO29CQUN4QyxNQUFNLGdCQUFnQixHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsVUFBVSxLQUFLLGlCQUFpQixDQUFDLElBQUksV0FBVyxDQUFDO29CQUN4RywrQkFBYyxDQUFDLE1BQU0sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLENBQUMsQ0FBQztvQkFDakQsT0FBTzthQUNSO1NBQ0Q7UUFFRCxRQUFRLENBQUMsd0JBQXdCLEVBQUUsQ0FBQztRQUNwQyxNQUFNLENBQUMsZUFBZSxFQUFFLENBQUM7SUFDMUIsQ0FBQyxDQUFDLENBQUM7SUFFSixTQUFTLFNBQVMsQ0FBQyxJQUFtQixFQUFFLEVBQW1CO1FBQzFELFFBQVEsSUFBSSxFQUFFO1lBQ2IsS0FBSyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUMsT0FBTyxNQUFNLENBQUMsU0FBUyxDQUFDLEVBQVksQ0FBQyxDQUFDO1lBQ25FLEtBQUssYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFZLENBQUMsQ0FBQztZQUN6RCxLQUFLLGFBQWEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLE1BQU0sQ0FBQyxVQUFVLENBQUMsRUFBWSxDQUFDLENBQUM7WUFDckUsS0FBSyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxNQUFNLENBQUMsT0FBTyxDQUFDLEVBQVksQ0FBQyxDQUFDO1lBQy9ELEtBQUssYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sTUFBTSxDQUFDLE9BQU8sQ0FBQyxFQUFZLENBQUMsQ0FBQztZQUMvRCxLQUFLLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsVUFBVSxLQUFLLEVBQUUsQ0FBQyxDQUFDO1NBQ25GO0lBQ0YsQ0FBQztJQUVELElBQVksYUFPWDtJQVBELFdBQVksYUFBYTtRQUN4Qix5REFBUSxDQUFBO1FBQ1IsK0NBQUcsQ0FBQTtRQUNILDJEQUFTLENBQUE7UUFDVCxxREFBTSxDQUFBO1FBQ04scURBQU0sQ0FBQTtRQUNOLHFEQUFNLENBQUE7SUFDUCxDQUFDLEVBUFcsYUFBYSxHQUFiLHFCQUFhLEtBQWIscUJBQWEsUUFPeEIifQ==