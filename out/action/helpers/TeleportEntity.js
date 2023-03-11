define(["require", "exports", "../../action/helpers/GetPosition", "../../IDebugTools"], function (require, exports, GetPosition_1, IDebugTools_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.teleportEntity = void 0;
    function teleportEntity(action, entity, position) {
        const targetTile = (0, GetPosition_1.default)(action.executor, position, () => (0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.ActionTeleport)
            .get(entity.getName()));
        if (!entity || !targetTile)
            return;
        if (entity.asCreature) {
            const tile = action.executor.island.getTile(entity.x, entity.y, entity.z);
            delete tile.creature;
        }
        if (entity.asNPC) {
            const tile = action.executor.island.getTile(entity.x, entity.y, entity.z);
            delete tile.npc;
        }
        if (entity.asPlayer) {
            entity.asPlayer.setPosition(targetTile);
        }
        else {
            entity.x = targetTile.x;
            entity.y = targetTile.y;
            entity.z = targetTile.z;
            const entityMovable = entity.asEntityMovable;
            if (entityMovable) {
                entityMovable.fromX = entity.x;
                entityMovable.fromY = entity.y;
            }
        }
        if (entity.asCreature) {
            const tile = action.executor.island.getTile(entity.x, entity.y, entity.z);
            tile.creature = entity.asCreature;
        }
        if (entity.asNPC) {
            const tile = action.executor.island.getTile(entity.x, entity.y, entity.z);
            tile.npc = entity.asNPC;
        }
        if (entity.asPlayer?.isLocalPlayer()) {
            gameScreen.movementHandler.walkToTileHandler.reset();
        }
        action.setUpdateView(true);
    }
    exports.teleportEntity = teleportEntity;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGVsZXBvcnRFbnRpdHkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYWN0aW9uL2hlbHBlcnMvVGVsZXBvcnRFbnRpdHkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztJQU9BLFNBQWdCLGNBQWMsQ0FBQyxNQUFzQixFQUFFLE1BQWMsRUFBRSxRQUFtQjtRQUN6RixNQUFNLFVBQVUsR0FBRyxJQUFBLHFCQUFXLEVBQUMsTUFBTSxDQUFDLFFBQWtCLEVBQUUsUUFBUyxFQUFFLEdBQUcsRUFBRSxDQUFDLElBQUEseUJBQVcsRUFBQyxtQ0FBcUIsQ0FBQyxjQUFjLENBQUM7YUFDMUgsR0FBRyxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFFekIsSUFBSSxDQUFDLE1BQU0sSUFBSSxDQUFDLFVBQVU7WUFBRSxPQUFPO1FBRW5DLElBQUksTUFBTSxDQUFDLFVBQVUsRUFBRTtZQUN0QixNQUFNLElBQUksR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMxRSxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUM7U0FDckI7UUFFRCxJQUFJLE1BQU0sQ0FBQyxLQUFLLEVBQUU7WUFDakIsTUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDMUUsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDO1NBQ2hCO1FBRUQsSUFBSSxNQUFNLENBQUMsUUFBUSxFQUFFO1lBQ3BCLE1BQU0sQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1NBRXhDO2FBQU07WUFDTixNQUFNLENBQUMsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxDQUFDLENBQUM7WUFDeEIsTUFBTSxDQUFDLENBQUMsR0FBRyxVQUFVLENBQUMsQ0FBQyxDQUFDO1lBQ3hCLE1BQU0sQ0FBQyxDQUFDLEdBQUcsVUFBVSxDQUFDLENBQUMsQ0FBQztZQUV4QixNQUFNLGFBQWEsR0FBRyxNQUFNLENBQUMsZUFBZSxDQUFDO1lBQzdDLElBQUksYUFBYSxFQUFFO2dCQUNsQixhQUFhLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQy9CLGFBQWEsQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQzthQUMvQjtTQUNEO1FBRUQsSUFBSSxNQUFNLENBQUMsVUFBVSxFQUFFO1lBQ3RCLE1BQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzFFLElBQUksQ0FBQyxRQUFRLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQztTQUNsQztRQUVELElBQUksTUFBTSxDQUFDLEtBQUssRUFBRTtZQUNqQixNQUFNLElBQUksR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMxRSxJQUFJLENBQUMsR0FBRyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUM7U0FDeEI7UUFFRCxJQUFJLE1BQU0sQ0FBQyxRQUFRLEVBQUUsYUFBYSxFQUFFLEVBQUU7WUFDckMsVUFBVyxDQUFDLGVBQWUsQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLEVBQUUsQ0FBQztTQUN0RDtRQUVELE1BQU0sQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDNUIsQ0FBQztJQTlDRCx3Q0E4Q0MifQ==