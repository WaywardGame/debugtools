define(["require", "exports", "entity/Entity", "entity/IEntity", "newui/screen/screens/GameScreen", "../../action/helpers/GetPosition", "../../IDebugTools"], function (require, exports, Entity_1, IEntity_1, GameScreen_1, GetPosition_1, IDebugTools_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function teleportEntity(action, entity, position) {
        position = GetPosition_1.default(action.executor, position, () => IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ActionTeleport)
            .get(entity.getName()));
        if (!entity || !position)
            return;
        if (Entity_1.default.is(entity, IEntity_1.EntityType.Creature)) {
            const tile = game.getTile(entity.x, entity.y, entity.z);
            delete tile.creature;
        }
        if (Entity_1.default.is(entity, IEntity_1.EntityType.NPC)) {
            const tile = game.getTile(entity.x, entity.y, entity.z);
            delete tile.npc;
        }
        if (Entity_1.default.is(entity, IEntity_1.EntityType.Player)) {
            entity.setPosition(position);
        }
        else {
            entity.x = entity.fromX = position.x;
            entity.y = entity.fromY = position.y;
            entity.z = position.z;
        }
        if (Entity_1.default.is(entity, IEntity_1.EntityType.Creature)) {
            const tile = game.getTile(entity.x, entity.y, entity.z);
            tile.creature = entity;
        }
        if (Entity_1.default.is(entity, IEntity_1.EntityType.NPC)) {
            const tile = game.getTile(entity.x, entity.y, entity.z);
            tile.npc = entity;
        }
        if (entity === localPlayer) {
            GameScreen_1.gameScreen.movementHandler.walkToTileHandler.reset();
        }
        action.setUpdateView(true);
    }
    exports.teleportEntity = teleportEntity;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGVsZXBvcnRFbnRpdHkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYWN0aW9uL2hlbHBlcnMvVGVsZXBvcnRFbnRpdHkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0lBU0EsU0FBZ0IsY0FBYyxDQUFDLE1BQXNCLEVBQUUsTUFBYyxFQUFFLFFBQW1CO1FBRXpGLFFBQVEsR0FBRyxxQkFBVyxDQUFDLE1BQU0sQ0FBQyxRQUFrQixFQUFFLFFBQVMsRUFBRSxHQUFHLEVBQUUsQ0FBQyx5QkFBVyxDQUFDLG1DQUFxQixDQUFDLGNBQWMsQ0FBQzthQUNsSCxHQUFHLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQztRQUV6QixJQUFJLENBQUMsTUFBTSxJQUFJLENBQUMsUUFBUTtZQUFFLE9BQU87UUFFakMsSUFBSSxnQkFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsb0JBQVUsQ0FBQyxRQUFRLENBQUMsRUFBRTtZQUMzQyxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDeEQsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDO1NBQ3JCO1FBRUQsSUFBSSxnQkFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsb0JBQVUsQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUN0QyxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDeEQsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDO1NBQ2hCO1FBRUQsSUFBSSxnQkFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsb0JBQVUsQ0FBQyxNQUFNLENBQUMsRUFBRTtZQUN6QyxNQUFNLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1NBRTdCO2FBQU07WUFDTixNQUFNLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxLQUFLLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQztZQUNyQyxNQUFNLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxLQUFLLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQztZQUNyQyxNQUFNLENBQUMsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUM7U0FDdEI7UUFFRCxJQUFJLGdCQUFNLENBQUMsRUFBRSxDQUFDLE1BQU0sRUFBRSxvQkFBVSxDQUFDLFFBQVEsQ0FBQyxFQUFFO1lBQzNDLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN4RCxJQUFJLENBQUMsUUFBUSxHQUFHLE1BQU0sQ0FBQztTQUN2QjtRQUVELElBQUksZ0JBQU0sQ0FBQyxFQUFFLENBQUMsTUFBTSxFQUFFLG9CQUFVLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFDdEMsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3hELElBQUksQ0FBQyxHQUFHLEdBQUcsTUFBTSxDQUFDO1NBQ2xCO1FBRUQsSUFBSSxNQUFNLEtBQUssV0FBVyxFQUFFO1lBQzNCLHVCQUFXLENBQUMsZUFBZSxDQUFDLGlCQUFpQixDQUFDLEtBQUssRUFBRSxDQUFDO1NBQ3REO1FBRUQsTUFBTSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUM1QixDQUFDO0lBekNELHdDQXlDQyJ9