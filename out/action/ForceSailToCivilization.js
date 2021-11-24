define(["require", "exports", "game/entity/action/Action", "game/entity/action/actions/Paddle", "game/entity/action/actions/SailToCivilization", "game/entity/IEntity", "game/item/IItem", "game/tile/ITerrain", "utilities/game/TileHelpers", "../Actions"], function (require, exports, Action_1, Paddle_1, SailToCivilization_1, IEntity_1, IItem_1, ITerrain_1, TileHelpers_1, Actions_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = new Action_1.Action()
        .setUsableBy(IEntity_1.EntityType.Player)
        .setUsableWhen(...Actions_1.defaultUsability)
        .setHandler(action => {
        const position = TileHelpers_1.default.findMatchingTile(action.executor.island, action.executor, (_1, _2, tile) => TileHelpers_1.default.getType(tile) === ITerrain_1.TerrainType.DeepSeawater);
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
            Paddle_1.default.execute(action.executor, sailboat);
            SailToCivilization_1.default.execute(action, sailboat, true);
        }
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRm9yY2VTYWlsVG9DaXZpbGl6YXRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvYWN0aW9uL0ZvcmNlU2FpbFRvQ2l2aWxpemF0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztJQVNBLGtCQUFlLElBQUksZUFBTSxFQUFFO1NBQ3pCLFdBQVcsQ0FBQyxvQkFBVSxDQUFDLE1BQU0sQ0FBQztTQUM5QixhQUFhLENBQUMsR0FBRywwQkFBZ0IsQ0FBQztTQUNsQyxVQUFVLENBQUMsTUFBTSxDQUFDLEVBQUU7UUFDcEIsTUFBTSxRQUFRLEdBQUcscUJBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsUUFBUSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLHFCQUFXLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLHNCQUFXLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDakssSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUNkLE9BQU87U0FDUDtRQUVELE1BQU0sQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBRXRDLE1BQU0sUUFBUSxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMscUJBQXFCLENBQUMsZ0JBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUUxRSxJQUFJLElBQUksQ0FBQyxXQUFXLEVBQUU7WUFDckIsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUM7U0FFL0I7YUFBTTtZQUNOLE1BQU0sQ0FBQyxRQUFRLENBQUMscUJBQXFCLENBQUMsZ0JBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUMxRCxNQUFNLENBQUMsUUFBUSxDQUFDLHFCQUFxQixDQUFDLGdCQUFRLENBQUMsYUFBYSxDQUFDLENBQUM7WUFDOUQsTUFBTSxDQUFDLFFBQVEsQ0FBQyxxQkFBcUIsQ0FBQyxnQkFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQzFELE1BQU0sQ0FBQyxRQUFRLENBQUMscUJBQXFCLENBQUMsZ0JBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUMzRCxNQUFNLENBQUMsUUFBUSxDQUFDLHFCQUFxQixDQUFDLGdCQUFRLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDMUQsTUFBTSxDQUFDLFFBQVEsQ0FBQyxxQkFBcUIsQ0FBQyxnQkFBUSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1NBQzlEO1FBRUQsSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLGFBQWEsRUFBRSxFQUFFO1lBQ3BDLGdCQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFDMUMsNEJBQWtCLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUM7U0FDbkQ7SUFDRixDQUFDLENBQUMsQ0FBQyJ9