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
define(["require", "exports", "@wayward/game/game/doodad/Doodad", "@wayward/game/game/entity/IEntity", "@wayward/game/game/entity/action/Action", "@wayward/game/game/entity/action/IAction", "../Actions", "../IDebugTools", "./helpers/CloneDoodad", "./helpers/CloneEntity", "./helpers/GetTile"], function (require, exports, Doodad_1, IEntity_1, Action_1, IAction_1, Actions_1, IDebugTools_1, CloneDoodad_1, CloneEntity_1, GetTile_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = new Action_1.Action(IAction_1.ActionArgument.ANY(IAction_1.ActionArgument.Entity, IAction_1.ActionArgument.Doodad), IAction_1.ActionArgument.Tile)
        .setUsableBy(IEntity_1.EntityType.Human)
        .setUsableWhen(...Actions_1.defaultUsability)
        .setCanUse(Actions_1.defaultCanUseHandler)
        .setHandler((action, toClone, tile) => {
        const targetTile = (0, GetTile_1.getTile)(action.executor, tile, () => (0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.ActionClone)
            .get(toClone.getName()));
        if (!targetTile) {
            return;
        }
        if (toClone instanceof Doodad_1.default) {
            (0, CloneDoodad_1.default)(toClone, targetTile);
        }
        else {
            (0, CloneEntity_1.default)(toClone, targetTile);
        }
        renderers.computeSpritesInViewport(targetTile);
        action.setUpdateRender();
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2xvbmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvYWN0aW9uL0Nsb25lLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7R0FTRzs7OztJQWdCSCxrQkFBZSxJQUFJLGVBQU0sQ0FBQyx3QkFBYyxDQUFDLEdBQUcsQ0FBQyx3QkFBYyxDQUFDLE1BQU0sRUFBRSx3QkFBYyxDQUFDLE1BQU0sQ0FBQyxFQUFFLHdCQUFjLENBQUMsSUFBSSxDQUFDO1NBQzlHLFdBQVcsQ0FBQyxvQkFBVSxDQUFDLEtBQUssQ0FBQztTQUM3QixhQUFhLENBQUMsR0FBRywwQkFBZ0IsQ0FBQztTQUNsQyxTQUFTLENBQUMsOEJBQW9CLENBQUM7U0FDL0IsVUFBVSxDQUFDLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxJQUFVLEVBQUUsRUFBRTtRQUMzQyxNQUFNLFVBQVUsR0FBRyxJQUFBLGlCQUFPLEVBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLENBQUMsSUFBQSx5QkFBVyxFQUFDLG1DQUFxQixDQUFDLFdBQVcsQ0FBQzthQUNwRyxHQUFHLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQztRQUMxQixJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7WUFDakIsT0FBTztRQUNSLENBQUM7UUFFRCxJQUFJLE9BQU8sWUFBWSxnQkFBTSxFQUFFLENBQUM7WUFDL0IsSUFBQSxxQkFBVyxFQUFDLE9BQU8sRUFBRSxVQUFVLENBQUMsQ0FBQztRQUVsQyxDQUFDO2FBQU0sQ0FBQztZQUNQLElBQUEscUJBQVcsRUFBQyxPQUFPLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFDbEMsQ0FBQztRQUVELFNBQVMsQ0FBQyx3QkFBd0IsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUMvQyxNQUFNLENBQUMsZUFBZSxFQUFFLENBQUM7SUFDMUIsQ0FBQyxDQUFDLENBQUMifQ==