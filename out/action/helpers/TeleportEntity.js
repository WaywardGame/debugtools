define(["require", "exports", "../../action/helpers/GetPosition", "../../IDebugTools"], function (require, exports, GetPosition_1, IDebugTools_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.teleportEntity = void 0;
    function teleportEntity(action, entity, position) {
        position = (0, GetPosition_1.default)(action.executor, position, () => (0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.ActionTeleport)
            .get(entity.getName()));
        if (!entity || !position)
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
            entity.asPlayer.setPosition(position);
        }
        else {
            entity.x = entity.fromX = position.x;
            entity.y = entity.fromY = position.y;
            entity.z = position.z;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGVsZXBvcnRFbnRpdHkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYWN0aW9uL2hlbHBlcnMvVGVsZXBvcnRFbnRpdHkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztJQU9BLFNBQWdCLGNBQWMsQ0FBQyxNQUFzQixFQUFFLE1BQWMsRUFBRSxRQUFtQjtRQUV6RixRQUFRLEdBQUcsSUFBQSxxQkFBVyxFQUFDLE1BQU0sQ0FBQyxRQUFrQixFQUFFLFFBQVMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxJQUFBLHlCQUFXLEVBQUMsbUNBQXFCLENBQUMsY0FBYyxDQUFDO2FBQ2xILEdBQUcsQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBRXpCLElBQUksQ0FBQyxNQUFNLElBQUksQ0FBQyxRQUFRO1lBQUUsT0FBTztRQUVqQyxJQUFJLE1BQU0sQ0FBQyxVQUFVLEVBQUU7WUFDdEIsTUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDMUUsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDO1NBQ3JCO1FBRUQsSUFBSSxNQUFNLENBQUMsS0FBSyxFQUFFO1lBQ2pCLE1BQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzFFLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQztTQUNoQjtRQUVELElBQUksTUFBTSxDQUFDLFFBQVEsRUFBRTtZQUNwQixNQUFNLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQztTQUV0QzthQUFNO1lBQ04sTUFBTSxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsS0FBSyxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFDckMsTUFBTSxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsS0FBSyxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFDckMsTUFBTSxDQUFDLENBQUMsR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDO1NBQ3RCO1FBRUQsSUFBSSxNQUFNLENBQUMsVUFBVSxFQUFFO1lBQ3RCLE1BQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzFFLElBQUksQ0FBQyxRQUFRLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQztTQUNsQztRQUVELElBQUksTUFBTSxDQUFDLEtBQUssRUFBRTtZQUNqQixNQUFNLElBQUksR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMxRSxJQUFJLENBQUMsR0FBRyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUM7U0FDeEI7UUFFRCxJQUFJLE1BQU0sQ0FBQyxRQUFRLEVBQUUsYUFBYSxFQUFFLEVBQUU7WUFDckMsVUFBVyxDQUFDLGVBQWUsQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLEVBQUUsQ0FBQztTQUN0RDtRQUVELE1BQU0sQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDNUIsQ0FBQztJQXpDRCx3Q0F5Q0MifQ==