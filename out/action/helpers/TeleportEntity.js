define(["require", "exports", "newui/screen/screens/GameScreen", "../../action/helpers/GetPosition", "../../IDebugTools"], function (require, exports, GameScreen_1, GetPosition_1, IDebugTools_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.teleportEntity = void 0;
    function teleportEntity(action, entity, position) {
        position = GetPosition_1.default(action.executor, position, () => IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ActionTeleport)
            .get(entity.getName()));
        if (!entity || !position)
            return;
        if (entity.asCreature) {
            const tile = game.getTile(entity.x, entity.y, entity.z);
            delete tile.creature;
        }
        if (entity.asNPC) {
            const tile = game.getTile(entity.x, entity.y, entity.z);
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
            const tile = game.getTile(entity.x, entity.y, entity.z);
            tile.creature = entity.asCreature;
        }
        if (entity.asNPC) {
            const tile = game.getTile(entity.x, entity.y, entity.z);
            tile.npc = entity.asNPC;
        }
        if (entity === localPlayer) {
            GameScreen_1.gameScreen.movementHandler.walkToTileHandler.reset();
        }
        action.setUpdateView(true);
    }
    exports.teleportEntity = teleportEntity;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGVsZXBvcnRFbnRpdHkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYWN0aW9uL2hlbHBlcnMvVGVsZXBvcnRFbnRpdHkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztJQVFBLFNBQWdCLGNBQWMsQ0FBQyxNQUFzQixFQUFFLE1BQWMsRUFBRSxRQUFtQjtRQUV6RixRQUFRLEdBQUcscUJBQVcsQ0FBQyxNQUFNLENBQUMsUUFBa0IsRUFBRSxRQUFTLEVBQUUsR0FBRyxFQUFFLENBQUMseUJBQVcsQ0FBQyxtQ0FBcUIsQ0FBQyxjQUFjLENBQUM7YUFDbEgsR0FBRyxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFFekIsSUFBSSxDQUFDLE1BQU0sSUFBSSxDQUFDLFFBQVE7WUFBRSxPQUFPO1FBRWpDLElBQUksTUFBTSxDQUFDLFVBQVUsRUFBRTtZQUN0QixNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDeEQsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDO1NBQ3JCO1FBRUQsSUFBSSxNQUFNLENBQUMsS0FBSyxFQUFFO1lBQ2pCLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN4RCxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUM7U0FDaEI7UUFFRCxJQUFJLE1BQU0sQ0FBQyxRQUFRLEVBQUU7WUFDcEIsTUFBTSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUM7U0FFdEM7YUFBTTtZQUNOLE1BQU0sQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLEtBQUssR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBQ3JDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLEtBQUssR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBQ3JDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQztTQUN0QjtRQUVELElBQUksTUFBTSxDQUFDLFVBQVUsRUFBRTtZQUN0QixNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDeEQsSUFBSSxDQUFDLFFBQVEsR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDO1NBQ2xDO1FBRUQsSUFBSSxNQUFNLENBQUMsS0FBSyxFQUFFO1lBQ2pCLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN4RCxJQUFJLENBQUMsR0FBRyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUM7U0FDeEI7UUFFRCxJQUFJLE1BQU0sS0FBSyxXQUFXLEVBQUU7WUFDM0IsdUJBQVcsQ0FBQyxlQUFlLENBQUMsaUJBQWlCLENBQUMsS0FBSyxFQUFFLENBQUM7U0FDdEQ7UUFFRCxNQUFNLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzVCLENBQUM7SUF6Q0Qsd0NBeUNDIn0=