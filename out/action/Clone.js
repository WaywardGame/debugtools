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
define(["require", "exports", "game/doodad/Doodad", "game/entity/action/Action", "game/entity/action/IAction", "game/entity/IEntity", "../Actions", "../IDebugTools", "./helpers/CloneDoodad", "./helpers/CloneEntity", "./helpers/GetTile"], function (require, exports, Doodad_1, Action_1, IAction_1, IEntity_1, Actions_1, IDebugTools_1, CloneDoodad_1, CloneEntity_1, GetTile_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = new Action_1.Action((0, IAction_1.anyOf)(IAction_1.ActionArgument.Entity, IAction_1.ActionArgument.Doodad), IAction_1.ActionArgument.Tile)
        .setUsableBy(IEntity_1.EntityType.Human)
        .setUsableWhen(...Actions_1.defaultUsability)
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2xvbmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvYWN0aW9uL0Nsb25lLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7R0FTRzs7OztJQWdCSCxrQkFBZSxJQUFJLGVBQU0sQ0FBQyxJQUFBLGVBQUssRUFBQyx3QkFBYyxDQUFDLE1BQU0sRUFBRSx3QkFBYyxDQUFDLE1BQU0sQ0FBQyxFQUFFLHdCQUFjLENBQUMsSUFBSSxDQUFDO1NBQ2pHLFdBQVcsQ0FBQyxvQkFBVSxDQUFDLEtBQUssQ0FBQztTQUM3QixhQUFhLENBQUMsR0FBRywwQkFBZ0IsQ0FBQztTQUNsQyxVQUFVLENBQUMsQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLElBQVUsRUFBRSxFQUFFO1FBQzNDLE1BQU0sVUFBVSxHQUFHLElBQUEsaUJBQU8sRUFBQyxNQUFNLENBQUMsUUFBUSxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyxJQUFBLHlCQUFXLEVBQUMsbUNBQXFCLENBQUMsV0FBVyxDQUFDO2FBQ3BHLEdBQUcsQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQzFCLElBQUksQ0FBQyxVQUFVLEVBQUU7WUFDaEIsT0FBTztTQUNQO1FBRUQsSUFBSSxPQUFPLFlBQVksZ0JBQU0sRUFBRTtZQUM5QixJQUFBLHFCQUFXLEVBQUMsT0FBTyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1NBRWpDO2FBQU07WUFDTixJQUFBLHFCQUFXLEVBQUMsT0FBTyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1NBQ2pDO1FBRUQsU0FBUyxDQUFDLHdCQUF3QixDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQy9DLE1BQU0sQ0FBQyxlQUFlLEVBQUUsQ0FBQztJQUMxQixDQUFDLENBQUMsQ0FBQyJ9