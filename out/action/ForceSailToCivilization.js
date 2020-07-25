define(["require", "exports", "entity/action/Action", "entity/IEntity", "../Actions", "entity/action/ActionExecutor", "entity/action/IAction", "item/IItem", "utilities/TileHelpers", "tile/ITerrain"], function (require, exports, Action_1, IEntity_1, Actions_1, ActionExecutor_1, IAction_1, IItem_1, TileHelpers_1, ITerrain_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = new Action_1.Action()
        .setUsableBy(IEntity_1.EntityType.Player)
        .setUsableWhen(...Actions_1.defaultUsability)
        .setHandler((action) => {
        const position = TileHelpers_1.default.findMatchingTile(action.executor, (_, tile) => TileHelpers_1.default.getType(tile) === ITerrain_1.TerrainType.DeepSeawater);
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
            ActionExecutor_1.default.get(IAction_1.ActionType.SailToCivilization).execute(action.executor, sailboat, true);
        }
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRm9yY2VTYWlsVG9DaXZpbGl6YXRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvYWN0aW9uL0ZvcmNlU2FpbFRvQ2l2aWxpemF0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztJQVNBLGtCQUFlLElBQUksZUFBTSxFQUFFO1NBQ3pCLFdBQVcsQ0FBQyxvQkFBVSxDQUFDLE1BQU0sQ0FBQztTQUM5QixhQUFhLENBQUMsR0FBRywwQkFBZ0IsQ0FBQztTQUNsQyxVQUFVLENBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRTtRQUN0QixNQUFNLFFBQVEsR0FBRyxxQkFBVyxDQUFDLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQyxxQkFBVyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxzQkFBVyxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQ3BJLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDZCxPQUFPO1NBQ1A7UUFFRCxNQUFNLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUV0QyxNQUFNLFFBQVEsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLHFCQUFxQixDQUFDLGdCQUFRLENBQUMsUUFBUSxDQUFDLENBQUM7UUFFMUUsSUFBSSxJQUFJLENBQUMsV0FBVyxFQUFFO1lBQ3JCLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO1NBRS9CO2FBQU07WUFDTixNQUFNLENBQUMsUUFBUSxDQUFDLHFCQUFxQixDQUFDLGdCQUFRLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDMUQsTUFBTSxDQUFDLFFBQVEsQ0FBQyxxQkFBcUIsQ0FBQyxnQkFBUSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBQzlELE1BQU0sQ0FBQyxRQUFRLENBQUMscUJBQXFCLENBQUMsZ0JBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUMxRCxNQUFNLENBQUMsUUFBUSxDQUFDLHFCQUFxQixDQUFDLGdCQUFRLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDM0QsTUFBTSxDQUFDLFFBQVEsQ0FBQyxxQkFBcUIsQ0FBQyxnQkFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQzFELE1BQU0sQ0FBQyxRQUFRLENBQUMscUJBQXFCLENBQUMsZ0JBQVEsQ0FBQyxhQUFhLENBQUMsQ0FBQztTQUM5RDtRQUVELElBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQyxhQUFhLEVBQUUsRUFBRTtZQUNwQyx3QkFBYyxDQUFDLEdBQUcsQ0FBQyxvQkFBVSxDQUFDLGtCQUFrQixDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDO1NBQzNGO0lBQ0YsQ0FBQyxDQUFDLENBQUMifQ==