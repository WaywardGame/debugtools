define(["require", "exports", "action/Action", "action/IAction", "entity/Entity", "entity/IEntity", "newui/screen/IScreen", "../action/helpers/GetPosition", "../Actions", "../IDebugTools"], function (require, exports, Action_1, IAction_1, Entity_1, IEntity_1, IScreen_1, GetPosition_1, Actions_1, IDebugTools_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = new Action_1.Action(IAction_1.ActionArgument.Entity, IAction_1.ActionArgument.Vector3)
        .setUsableBy(IEntity_1.EntityType.Player)
        .setUsableWhen(...Actions_1.defaultUsability)
        .setHandler((action, entity, position) => {
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
            newui.getScreen(IScreen_1.ScreenId.Game).movementHandler.walkToTileHandler.reset();
        }
        game.updateView(true);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGVsZXBvcnRFbnRpdHkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvYWN0aW9uL1RlbGVwb3J0RW50aXR5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztJQWNBLGtCQUFlLElBQUksZUFBTSxDQUFDLHdCQUFjLENBQUMsTUFBTSxFQUFFLHdCQUFjLENBQUMsT0FBTyxDQUFDO1NBQ3RFLFdBQVcsQ0FBQyxvQkFBVSxDQUFDLE1BQU0sQ0FBQztTQUM5QixhQUFhLENBQUMsR0FBRywwQkFBZ0IsQ0FBQztTQUNsQyxVQUFVLENBQUMsQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLFFBQW1CLEVBQUUsRUFBRTtRQUVuRCxRQUFRLEdBQUcscUJBQVcsQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLFFBQVMsRUFBRSxHQUFHLEVBQUUsQ0FBQyx5QkFBVyxDQUFDLG1DQUFxQixDQUFDLGNBQWMsQ0FBQzthQUN4RyxHQUFHLENBQUMsTUFBTyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQztRQUUxQixJQUFJLENBQUMsTUFBTSxJQUFJLENBQUMsUUFBUTtZQUFFLE9BQU87UUFFakMsSUFBSSxnQkFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsb0JBQVUsQ0FBQyxRQUFRLENBQUMsRUFBRTtZQUMzQyxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDeEQsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDO1NBQ3JCO1FBRUQsSUFBSSxnQkFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsb0JBQVUsQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUN0QyxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDeEQsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDO1NBQ2hCO1FBRUQsSUFBSSxnQkFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsb0JBQVUsQ0FBQyxNQUFNLENBQUMsRUFBRTtZQUN6QyxNQUFNLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1NBRTdCO2FBQU07WUFDTixNQUFNLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxLQUFLLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQztZQUNyQyxNQUFNLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxLQUFLLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQztZQUNyQyxNQUFNLENBQUMsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUM7U0FDdEI7UUFFRCxJQUFJLGdCQUFNLENBQUMsRUFBRSxDQUFDLE1BQU0sRUFBRSxvQkFBVSxDQUFDLFFBQVEsQ0FBQyxFQUFFO1lBQzNDLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN4RCxJQUFJLENBQUMsUUFBUSxHQUFHLE1BQU0sQ0FBQztTQUN2QjtRQUVELElBQUksZ0JBQU0sQ0FBQyxFQUFFLENBQUMsTUFBTSxFQUFFLG9CQUFVLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFDdEMsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3hELElBQUksQ0FBQyxHQUFHLEdBQUcsTUFBTSxDQUFDO1NBQ2xCO1FBRUQsSUFBSSxNQUFNLEtBQUssV0FBVyxFQUFFO1lBQzNCLEtBQUssQ0FBQyxTQUFTLENBQWEsa0JBQVEsQ0FBQyxJQUFJLENBQUUsQ0FBQyxlQUFlLENBQUMsaUJBQWlCLENBQUMsS0FBSyxFQUFFLENBQUM7U0FDdEY7UUFFRCxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3ZCLENBQUMsQ0FBQyxDQUFDIn0=