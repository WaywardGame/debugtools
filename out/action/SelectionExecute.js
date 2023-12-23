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
define(["require", "exports", "@wayward/game/game/entity/Entity", "@wayward/game/game/entity/IEntity", "@wayward/game/game/entity/action/Action", "@wayward/game/game/entity/action/IAction", "@wayward/game/game/entity/player/Player", "@wayward/game/utilities/math/IVector", "@wayward/game/utilities/math/Vector3", "../Actions", "../IDebugTools", "./helpers/Remove", "./helpers/TeleportEntity"], function (require, exports, Entity_1, IEntity_1, Action_1, IAction_1, Player_1, IVector_1, Vector3_1, Actions_1, IDebugTools_1, Remove_1, TeleportEntity_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SelectionType = void 0;
    exports.default = new Action_1.Action(IAction_1.ActionArgument.Integer32, IAction_1.ActionArgument.Array, IAction_1.ActionArgument.OPTIONAL(IAction_1.ActionArgument.String))
        .setUsableBy(IEntity_1.EntityType.Human)
        .setUsableWhen(...Actions_1.defaultUsability)
        .setCanUse(Actions_1.defaultCanUseHandler)
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2VsZWN0aW9uRXhlY3V0ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hY3Rpb24vU2VsZWN0aW9uRXhlY3V0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7O0dBU0c7Ozs7O0lBeUJILGtCQUFlLElBQUksZUFBTSxDQUFDLHdCQUFjLENBQUMsU0FBUyxFQUFFLHdCQUFjLENBQUMsS0FBSyxFQUFFLHdCQUFjLENBQUMsUUFBUSxDQUFDLHdCQUFjLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDdkgsV0FBVyxDQUFDLG9CQUFVLENBQUMsS0FBSyxDQUFDO1NBQzdCLGFBQWEsQ0FBQyxHQUFHLDBCQUFnQixDQUFDO1NBQ2xDLFNBQVMsQ0FBQyw4QkFBb0IsQ0FBQztTQUMvQixVQUFVLENBQUMsQ0FBQyxNQUFNLEVBQUUsYUFBb0MsRUFBRSxTQUFvQyxFQUFFLGlCQUFpQixFQUFFLEVBQUU7UUFDckgsS0FBSyxNQUFNLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxJQUFJLFNBQVMsRUFBRSxDQUFDO1lBQ3BDLE1BQU0sTUFBTSxHQUFHLFNBQVMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDM0QsSUFBSSxDQUFDLE1BQU07Z0JBQUUsU0FBUztZQUV0QixRQUFRLGFBQWEsRUFBRSxDQUFDO2dCQUN2QixLQUFLLG1DQUFxQixDQUFDLFlBQVk7b0JBQ3RDLElBQUksTUFBTSxZQUFZLGdCQUFNO3dCQUFFLFNBQVM7b0JBQ3ZDLElBQUksQ0FBQyxDQUFDLE1BQU0sWUFBWSxnQkFBTSxDQUFDLElBQUksa0JBQVEsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDO3dCQUFFLFNBQVM7b0JBQ2pFLElBQUEsZ0JBQU0sRUFBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUM7b0JBQ3ZCLE1BQU07Z0JBQ1AsS0FBSyxtQ0FBcUIsQ0FBQyxjQUFjO29CQUN4QyxNQUFN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