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
define(["require", "exports", "@wayward/game/game/entity/action/Action", "@wayward/game/game/entity/action/actions/Ride", "@wayward/game/game/entity/action/actions/SailToCivilization", "@wayward/game/game/entity/IEntity", "@wayward/game/game/item/IItem", "@wayward/game/game/tile/ITerrain", "../Actions"], function (require, exports, Action_1, Ride_1, SailToCivilization_1, IEntity_1, IItem_1, ITerrain_1, Actions_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = new Action_1.Action()
        .setUsableBy(IEntity_1.EntityType.Player)
        .setUsableWhen(...Actions_1.defaultUsability)
        .setCanUse(Actions_1.defaultCanUseHandler)
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
        if (action.executor.isLocalPlayer) {
            Ride_1.default.execute(action.executor, sailboat);
            SailToCivilization_1.default.execute(action, sailboat, true);
        }
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRm9yY2VTYWlsVG9DaXZpbGl6YXRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvYWN0aW9uL0ZvcmNlU2FpbFRvQ2l2aWxpemF0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7R0FTRzs7OztJQVVILGtCQUFlLElBQUksZUFBTSxFQUFFO1NBQ3pCLFdBQVcsQ0FBQyxvQkFBVSxDQUFDLE1BQU0sQ0FBQztTQUM5QixhQUFhLENBQUMsR0FBRywwQkFBZ0IsQ0FBQztTQUNsQyxTQUFTLENBQUMsOEJBQW9CLENBQUM7U0FDL0IsVUFBVSxDQUFDLE1BQU0sQ0FBQyxFQUFFO1FBQ3BCLE1BQU0sUUFBUSxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLHNCQUFXLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDekcsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQ2YsT0FBTztRQUNSLENBQUM7UUFFRCxNQUFNLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUV0QyxNQUFNLFFBQVEsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLHFCQUFxQixDQUFDLGdCQUFRLENBQUMsUUFBUSxDQUFDLENBQUM7UUFFMUUsSUFBSSxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDdEIsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUM7UUFFaEMsQ0FBQzthQUFNLENBQUM7WUFDUCxNQUFNLENBQUMsUUFBUSxDQUFDLHFCQUFxQixDQUFDLGdCQUFRLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDMUQsTUFBTSxDQUFDLFFBQVEsQ0FBQyxxQkFBcUIsQ0FBQyxnQkFBUSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBQzlELE1BQU0sQ0FBQyxRQUFRLENBQUMscUJBQXFCLENBQUMsZ0JBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUMxRCxNQUFNLENBQUMsUUFBUSxDQUFDLHFCQUFxQixDQUFDLGdCQUFRLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDM0QsTUFBTSxDQUFDLFFBQVEsQ0FBQyxxQkFBcUIsQ0FBQyxnQkFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQzFELE1BQU0sQ0FBQyxRQUFRLENBQUMscUJBQXFCLENBQUMsZ0JBQVEsQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUMvRCxDQUFDO1FBRUQsSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLGFBQWEsRUFBRSxDQUFDO1lBQ25DLGNBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQztZQUN4Qyw0QkFBa0IsQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNwRCxDQUFDO0lBQ0YsQ0FBQyxDQUFDLENBQUMifQ==