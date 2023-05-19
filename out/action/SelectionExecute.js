/*!
 * Copyright 2011-2023 Unlok
 * https://www.unlok.ca
 *
 * Credits & Thanks:
 * https://www.unlok.ca/credits-thanks/
 *
 * Wayward is a copyrighted and licensed work. Modification and/or distribution of any source files is prohibited. If you wish to modify the game in any way, please refer to the modding guide:
 * https://github.com/WaywardGame/types/wiki
 */
define(["require", "exports", "game/entity/action/Action", "game/entity/action/IAction", "game/entity/IEntity", "game/entity/player/Player", "../Actions", "../IDebugTools", "./helpers/Remove", "./helpers/TeleportEntity"], function (require, exports, Action_1, IAction_1, IEntity_1, Player_1, Actions_1, IDebugTools_1, Remove_1, TeleportEntity_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SelectionType = void 0;
    exports.default = new Action_1.Action(IAction_1.ActionArgument.Integer32, IAction_1.ActionArgument.Array, (0, IAction_1.optional)(IAction_1.ActionArgument.String))
        .setUsableBy(IEntity_1.EntityType.Human)
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
                        (0, TeleportEntity_1.teleportEntity)(action, playerToTeleport, target.tile);
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
    })(SelectionType || (exports.SelectionType = SelectionType = {}));
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2VsZWN0aW9uRXhlY3V0ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hY3Rpb24vU2VsZWN0aW9uRXhlY3V0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7O0dBU0c7Ozs7O0lBaUJILGtCQUFlLElBQUksZUFBTSxDQUFDLHdCQUFjLENBQUMsU0FBUyxFQUFFLHdCQUFjLENBQUMsS0FBSyxFQUFFLElBQUEsa0JBQVEsRUFBQyx3QkFBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQ3hHLFdBQVcsQ0FBQyxvQkFBVSxDQUFDLEtBQUssQ0FBQztTQUM3QixhQUFhLENBQUMsR0FBRywwQkFBZ0IsQ0FBQztTQUNsQyxVQUFVLENBQUMsQ0FBQyxNQUFNLEVBQUUsYUFBb0MsRUFBRSxTQUFvQyxFQUFFLGlCQUFpQixFQUFFLEVBQUU7UUFDckgsS0FBSyxNQUFNLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxJQUFJLFNBQVMsRUFBRTtZQUNuQyxNQUFNLE1BQU0sR0FBRyxTQUFTLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQzNELElBQUksQ0FBQyxNQUFNO2dCQUFFLFNBQVM7WUFFdEIsUUFBUSxhQUFhLEVBQUU7Z0JBQ3RCLEtBQUssbUNBQXFCLENBQUMsWUFBWTtvQkFDdEMsSUFBSSxNQUFNLFlBQVksZ0JBQU07d0JBQUUsU0FBUztvQkFDdkMsSUFBQSxnQkFBTSxFQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztvQkFDdkIsTUFBTTtnQkFDUCxLQUFLLG1DQUFxQixDQUFDLGNBQWM7b0JBQ3hDLE1BQU0sZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxVQUFVLEtBQUssaUJBQWlCLENBQUMsQ0FBQztvQkFDdkgsSUFBSSxnQkFBZ0IsRUFBRTt3QkFDckIsSUFBQSwrQkFBYyxFQUFDLE1BQU0sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7cUJBQ3REO29CQUNELE9BQU87YUFDUjtTQUNEO1FBRUQsU0FBUyxDQUFDLHdCQUF3QixDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNwRCxNQUFNLENBQUMsZUFBZSxFQUFFLENBQUM7SUFDMUIsQ0FBQyxDQUFDLENBQUM7SUFFSixTQUFTLFNBQVMsQ0FBQyxNQUFjLEVBQUUsSUFBbUIsRUFBRSxFQUFtQjtRQUMxRSxRQUFRLElBQUksRUFBRTtZQUNiLEtBQUssYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDLE9BQU8sTUFBTSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsRUFBWSxDQUFDLENBQUM7WUFDdkUsS0FBSyxhQUFhLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFZLENBQUMsQ0FBQztZQUM3RCxLQUFLLGFBQWEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLE1BQU0sQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLEVBQVksQ0FBQyxDQUFDO1lBQ3pFLEtBQUssYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBWSxDQUFDLENBQUM7WUFDbkUsS0FBSyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFZLENBQUMsQ0FBQztZQUNuRSxLQUFLLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsVUFBVSxLQUFLLEVBQUUsQ0FBQyxDQUFDO1NBQ2pIO0lBQ0YsQ0FBQztJQUVELElBQVksYUFPWDtJQVBELFdBQVksYUFBYTtRQUN4Qix5REFBUSxDQUFBO1FBQ1IsK0NBQUcsQ0FBQTtRQUNILDJEQUFTLENBQUE7UUFDVCxxREFBTSxDQUFBO1FBQ04scURBQU0sQ0FBQTtRQUNOLHFEQUFNLENBQUE7SUFDUCxDQUFDLEVBUFcsYUFBYSw2QkFBYixhQUFhLFFBT3hCIn0=