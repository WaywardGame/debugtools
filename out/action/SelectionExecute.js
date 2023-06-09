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
define(["require", "exports", "game/entity/Entity", "game/entity/IEntity", "game/entity/action/Action", "game/entity/action/IAction", "game/entity/player/Player", "utilities/math/IVector", "utilities/math/Vector3", "../Actions", "../IDebugTools", "./helpers/Remove", "./helpers/TeleportEntity"], function (require, exports, Entity_1, IEntity_1, Action_1, IAction_1, Player_1, IVector_1, Vector3_1, Actions_1, IDebugTools_1, Remove_1, TeleportEntity_1) {
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
                    if (!(target instanceof Entity_1.default) && IVector_1.IVector3.is(target))
                        continue;
                    (0, Remove_1.default)(action, target);
                    break;
                case IDebugTools_1.DebugToolsTranslation.ActionTeleport:
                    const playerToTeleport = game.playerManager.getAll(true, true).find(player => player.identifier === alternativeTarget);
                    if (playerToTeleport) {
                        (0, TeleportEntity_1.teleportEntity)(action, playerToTeleport, target instanceof Entity_1.default ? target.tile : action.executor.island.getTile(...target.xyz));
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
            case SelectionType.Location: return island.treasureMaps
                .flatMap(map => map.getTreasure()
                .map(treasure => new Vector3_1.default(treasure, map.position.z)))
                .find(treasure => treasure.xyz.join(",") === id);
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
        SelectionType[SelectionType["Location"] = 6] = "Location";
    })(SelectionType || (exports.SelectionType = SelectionType = {}));
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2VsZWN0aW9uRXhlY3V0ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hY3Rpb24vU2VsZWN0aW9uRXhlY3V0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7O0dBU0c7Ozs7O0lBb0JILGtCQUFlLElBQUksZUFBTSxDQUFDLHdCQUFjLENBQUMsU0FBUyxFQUFFLHdCQUFjLENBQUMsS0FBSyxFQUFFLElBQUEsa0JBQVEsRUFBQyx3QkFBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQ3hHLFdBQVcsQ0FBQyxvQkFBVSxDQUFDLEtBQUssQ0FBQztTQUM3QixhQUFhLENBQUMsR0FBRywwQkFBZ0IsQ0FBQztTQUNsQyxVQUFVLENBQUMsQ0FBQyxNQUFNLEVBQUUsYUFBb0MsRUFBRSxTQUFvQyxFQUFFLGlCQUFpQixFQUFFLEVBQUU7UUFDckgsS0FBSyxNQUFNLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxJQUFJLFNBQVMsRUFBRTtZQUNuQyxNQUFNLE1BQU0sR0FBRyxTQUFTLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQzNELElBQUksQ0FBQyxNQUFNO2dCQUFFLFNBQVM7WUFFdEIsUUFBUSxhQUFhLEVBQUU7Z0JBQ3RCLEtBQUssbUNBQXFCLENBQUMsWUFBWTtvQkFDdEMsSUFBSSxNQUFNLFlBQVksZ0JBQU07d0JBQUUsU0FBUztvQkFDdkMsSUFBSSxDQUFDLENBQUMsTUFBTSxZQUFZLGdCQUFNLENBQUMsSUFBSSxrQkFBUSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUM7d0JBQUUsU0FBUztvQkFDakUsSUFBQSxnQkFBTSxFQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztvQkFDdkIsTUFBTTtnQkFDUCxLQUFLLG1DQUFxQixDQUFDLGNBQWM7b0JBQ3hDLE1BQU0sZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMs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