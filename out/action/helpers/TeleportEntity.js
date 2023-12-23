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
define(["require", "exports", "../../IDebugTools", "./GetTile", "@wayward/game/game/entity/IEntity"], function (require, exports, IDebugTools_1, GetTile_1, IEntity_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.teleportEntity = void 0;
    function teleportEntity(action, entity, tile) {
        const canUse = action.canUse();
        if (!canUse.usable) {
            return;
        }
        const targetTile = (0, GetTile_1.getTile)(action.executor, tile, () => (0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.ActionTeleport)
            .get(entity.getName()));
        if (!entity || !targetTile)
            return;
        if (entity.asPlayer) {
            entity.asPlayer.setPosition(targetTile);
        }
        else {
            const entityMovable = entity.asEntityMovable;
            if (entityMovable) {
                entityMovable.moveTo(targetTile, { animation: IEntity_1.MoveAnimation.Teleport });
            }
            else {
                entity.x = targetTile.x;
                entity.y = targetTile.y;
                entity.z = targetTile.z;
                entity.clearTileCache();
            }
        }
        if (entity.asPlayer?.isLocalPlayer) {
            gameScreen.movementHandler.walkToTileHandler.reset();
        }
        action.setUpdateView(true);
    }
    exports.teleportEntity = teleportEntity;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGVsZXBvcnRFbnRpdHkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYWN0aW9uL2hlbHBlcnMvVGVsZXBvcnRFbnRpdHkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7OztHQVNHOzs7OztJQVVILFNBQWdCLGNBQWMsQ0FBQyxNQUFzQixFQUFFLE1BQWMsRUFBRSxJQUFVO1FBQ2hGLE1BQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUMvQixJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQ3BCLE9BQU87UUFDUixDQUFDO1FBRUQsTUFBTSxVQUFVLEdBQUcsSUFBQSxpQkFBTyxFQUFDLE1BQU0sQ0FBQyxRQUFrQixFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyxJQUFBLHlCQUFXLEVBQUMsbUNBQXFCLENBQUMsY0FBYyxDQUFDO2FBQ2pILEdBQUcsQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBRXpCLElBQUksQ0FBQyxNQUFNLElBQUksQ0FBQyxVQUFVO1lBQUUsT0FBTztRQUVuQyxJQUFJLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUNyQixNQUFNLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUV6QyxDQUFDO2FBQU0sQ0FBQztZQUNQLE1BQU0sYUFBYSxHQUFHLE1BQU0sQ0FBQyxlQUFlLENBQUM7WUFDN0MsSUFBSSxhQUFhLEVBQUUsQ0FBQztnQkFDbkIsYUFBYSxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUUsRUFBRSxTQUFTLEVBQUUsdUJBQWEsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO1lBRXpFLENBQUM7aUJBQU0sQ0FBQztnQkFDUCxNQUFNLENBQUMsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxDQUFDLENBQUM7Z0JBQ3hCLE1BQU0sQ0FBQyxDQUFDLEdBQUcsVUFBVSxDQUFDLENBQUMsQ0FBQztnQkFDeEIsTUFBTSxDQUFDLENBQUMsR0FBRyxVQUFVLENBQUMsQ0FBQyxDQUFDO2dCQUN4QixNQUFNLENBQUMsY0FBYyxFQUFFLENBQUM7WUFDekIsQ0FBQztRQUNGLENBQUM7UUFFRCxJQUFJLE1BQU0sQ0FBQyxRQUFRLEVBQUUsYUFBYSxFQUFFLENBQUM7WUFDcEMsVUFBVyxDQUFDLGVBQWUsQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUN2RCxDQUFDO1FBRUQsTUFBTSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUM1QixDQUFDO0lBaENELHdDQWdDQyJ9