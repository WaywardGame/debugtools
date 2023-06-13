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
define(["require", "exports", "../../IDebugTools", "./GetTile", "game/entity/IEntity"], function (require, exports, IDebugTools_1, GetTile_1, IEntity_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.teleportEntity = void 0;
    function teleportEntity(action, entity, tile) {
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
        if (entity.asPlayer?.isLocalPlayer()) {
            gameScreen.movementHandler.walkToTileHandler.reset();
        }
        action.setUpdateView(true);
    }
    exports.teleportEntity = teleportEntity;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGVsZXBvcnRFbnRpdHkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYWN0aW9uL2hlbHBlcnMvVGVsZXBvcnRFbnRpdHkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7OztHQVNHOzs7OztJQVVILFNBQWdCLGNBQWMsQ0FBQyxNQUFzQixFQUFFLE1BQWMsRUFBRSxJQUFVO1FBQ2hGLE1BQU0sVUFBVSxHQUFHLElBQUEsaUJBQU8sRUFBQyxNQUFNLENBQUMsUUFBa0IsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLENBQUMsSUFBQSx5QkFBVyxFQUFDLG1DQUFxQixDQUFDLGNBQWMsQ0FBQzthQUNqSCxHQUFHLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQztRQUV6QixJQUFJLENBQUMsTUFBTSxJQUFJLENBQUMsVUFBVTtZQUFFLE9BQU87UUFFbkMsSUFBSSxNQUFNLENBQUMsUUFBUSxFQUFFO1lBQ3BCLE1BQU0sQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1NBRXhDO2FBQU07WUFDTixNQUFNLGFBQWEsR0FBRyxNQUFNLENBQUMsZUFBZSxDQUFDO1lBQzdDLElBQUksYUFBYSxFQUFFO2dCQUNsQixhQUFhLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRSxFQUFFLFNBQVMsRUFBRSx1QkFBYSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7YUFFeEU7aUJBQU07Z0JBQ04sTUFBTSxDQUFDLENBQUMsR0FBRyxVQUFVLENBQUMsQ0FBQyxDQUFDO2dCQUN4QixNQUFNLENBQUMsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxDQUFDLENBQUM7Z0JBQ3hCLE1BQU0sQ0FBQyxDQUFDLEdBQUcsVUFBVSxDQUFDLENBQUMsQ0FBQztnQkFDeEIsTUFBTSxDQUFDLGNBQWMsRUFBRSxDQUFDO2FBQ3hCO1NBQ0Q7UUFFRCxJQUFJLE1BQU0sQ0FBQyxRQUFRLEVBQUUsYUFBYSxFQUFFLEVBQUU7WUFDckMsVUFBVyxDQUFDLGVBQWUsQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLEVBQUUsQ0FBQztTQUN0RDtRQUVELE1BQU0sQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDNUIsQ0FBQztJQTNCRCx3Q0EyQkMifQ==