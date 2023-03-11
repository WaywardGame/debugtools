define(["require", "exports", "game/entity/action/Action", "game/entity/action/actions/Ride", "game/entity/action/actions/SailToCivilization", "game/entity/IEntity", "game/item/IItem", "game/tile/ITerrain", "../Actions"], function (require, exports, Action_1, Ride_1, SailToCivilization_1, IEntity_1, IItem_1, ITerrain_1, Actions_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = new Action_1.Action()
        .setUsableBy(IEntity_1.EntityType.Player)
        .setUsableWhen(...Actions_1.defaultUsability)
        .setHandler(action => {
        const position = action.executor.tile.findMatchingTile((tile) => tile.type === ITerrain_1.TerrainType.DeepSeawater);
        if (!position) {
            return;
        }
        action.executor.setPosition(position);
        const sailboat = action.executor.createItemInInventory(IItem_1.ItemType.Sailboat);
        if (game.isChallenge) {
            action.executor.quests.reset();
        }
        else {
            action.executor.createItemInInventory(IItem_1.ItemType.GoldCoins);
            action.executor.createItemInInventory(IItem_1.ItemType.GoldenChalice);
            action.executor.createItemInInventory(IItem_1.ItemType.GoldenKey);
            action.executor.createItemInInventory(IItem_1.ItemType.GoldenRing);
            action.executor.createItemInInventory(IItem_1.ItemType.GoldSword);
            action.executor.createItemInInventory(IItem_1.ItemType.GoldenSextant);
        }
        if (action.executor.isLocalPlayer()) {
            Ride_1.default.execute(action.executor, sailboat);
            SailToCivilization_1.default.execute(action, sailboat, true);
        }
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRm9yY2VTYWlsVG9DaXZpbGl6YXRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvYWN0aW9uL0ZvcmNlU2FpbFRvQ2l2aWxpemF0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztJQVFBLGtCQUFlLElBQUksZUFBTSxFQUFFO1NBQ3pCLFdBQVcsQ0FBQyxvQkFBVSxDQUFDLE1BQU0sQ0FBQztTQUM5QixhQUFhLENBQUMsR0FBRywwQkFBZ0IsQ0FBQztTQUNsQyxVQUFVLENBQUMsTUFBTSxDQUFDLEVBQUU7UUFDcEIsTUFBTSxRQUFRLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssc0JBQVcsQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUN6RyxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ2QsT0FBTztTQUNQO1FBRUQsTUFBTSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUM7UUFFdEMsTUFBTSxRQUFRLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxxQkFBcUIsQ0FBQyxnQkFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBRTFFLElBQUksSUFBSSxDQUFDLFdBQVcsRUFBRTtZQUNyQixNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztTQUUvQjthQUFNO1lBQ04sTUFBTSxDQUFDLFFBQVEsQ0FBQyxxQkFBcUIsQ0FBQyxnQkFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQzFELE1BQU0sQ0FBQyxRQUFRLENBQUMscUJBQXFCLENBQUMsZ0JBQVEsQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUM5RCxNQUFNLENBQUMsUUFBUSxDQUFDLHFCQUFxQixDQUFDLGdCQUFRLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDMUQsTUFBTSxDQUFDLFFBQVEsQ0FBQyxxQkFBcUIsQ0FBQyxnQkFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQzNELE1BQU0sQ0FBQyxRQUFRLENBQUMscUJBQXFCLENBQUMsZ0JBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUMxRCxNQUFNLENBQUMsUUFBUSxDQUFDLHFCQUFxQixDQUFDLGdCQUFRLENBQUMsYUFBYSxDQUFDLENBQUM7U0FDOUQ7UUFFRCxJQUFJLE1BQU0sQ0FBQyxRQUFRLENBQUMsYUFBYSxFQUFFLEVBQUU7WUFDcEMsY0FBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBQ3hDLDRCQUFrQixDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDO1NBQ25EO0lBQ0YsQ0FBQyxDQUFDLENBQUMifQ==