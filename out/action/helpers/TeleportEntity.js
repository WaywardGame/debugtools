define(["require", "exports", "../../action/helpers/GetPosition", "../../IDebugTools"], function (require, exports, GetPosition_1, IDebugTools_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.teleportEntity = void 0;
    function teleportEntity(action, entity, position) {
        var _a;
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
        if ((_a = entity.asPlayer) === null || _a === void 0 ? void 0 : _a.isLocalPlayer()) {
            gameScreen.movementHandler.walkToTileHandler.reset();
        }
        action.setUpdateView(true);
    }
    exports.teleportEntity = teleportEntity;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGVsZXBvcnRFbnRpdHkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYWN0aW9uL2hlbHBlcnMvVGVsZXBvcnRFbnRpdHkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztJQU9BLFNBQWdCLGNBQWMsQ0FBQyxNQUFzQixFQUFFLE1BQWMsRUFBRSxRQUFtQjs7UUFFekYsUUFBUSxHQUFHLElBQUEscUJBQVcsRUFBQyxNQUFNLENBQUMsUUFBa0IsRUFBRSxRQUFTLEVBQUUsR0FBRyxFQUFFLENBQUMsSUFBQSx5QkFBVyxFQUFDLG1DQUFxQixDQUFDLGNBQWMsQ0FBQzthQUNsSCxHQUFHLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQztRQUV6QixJQUFJLENBQUMsTUFBTSxJQUFJLENBQUMsUUFBUTtZQUFFLE9BQU87UUFFakMsSUFBSSxNQUFNLENBQUMsVUFBVSxFQUFFO1lBQ3RCLE1BQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzFFLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQztTQUNyQjtRQUVELElBQUksTUFBTSxDQUFDLEtBQUssRUFBRTtZQUNqQixNQUFNLElBQUksR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMxRSxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUM7U0FDaEI7UUFFRCxJQUFJLE1BQU0sQ0FBQyxRQUFRLEVBQUU7WUFDcEIsTUFBTSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUM7U0FFdEM7YUFBTTtZQUNOLE1BQU0sQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLEtBQUssR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBQ3JDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLEtBQUssR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBQ3JDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQztTQUN0QjtRQUVELElBQUksTUFBTSxDQUFDLFVBQVUsRUFBRTtZQUN0QixNQUFNLElBQUksR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMxRSxJQUFJLENBQUMsUUFBUSxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUM7U0FDbEM7UUFFRCxJQUFJLE1BQU0sQ0FBQyxLQUFLLEVBQUU7WUFDakIsTUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDMUUsSUFBSSxDQUFDLEdBQUcsR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDO1NBQ3hCO1FBRUQsSUFBSSxNQUFBLE1BQU0sQ0FBQyxRQUFRLDBDQUFFLGFBQWEsRUFBRSxFQUFFO1lBQ3JDLFVBQVcsQ0FBQyxlQUFlLENBQUMsaUJBQWlCLENBQUMsS0FBSyxFQUFFLENBQUM7U0FDdEQ7UUFFRCxNQUFNLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzVCLENBQUM7SUF6Q0Qsd0NBeUNDIn0=