define(["require", "exports", "game/entity/action/Action", "game/entity/action/IAction", "game/entity/IEntity", "game/item/IItem", "utilities/enum/Enums", "utilities/random/Random", "../Actions", "../ui/InspectDialog"], function (require, exports, Action_1, IAction_1, IEntity_1, IItem_1, Enums_1, Random_1, Actions_1, InspectDialog_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ADD_ITEM_ALL = exports.ADD_ITEM_RANDOM = void 0;
    exports.ADD_ITEM_RANDOM = 1000000001;
    exports.ADD_ITEM_ALL = 1000000002;
    exports.default = new Action_1.Action(IAction_1.anyOf(IAction_1.ActionArgument.Container, IAction_1.ActionArgument.Player), IAction_1.ActionArgument.Integer, IAction_1.ActionArgument.Quality, IAction_1.ActionArgument.Integer)
        .setUsableBy(IEntity_1.EntityType.Player)
        .setUsableWhen(...Actions_1.defaultUsability)
        .setHandler((action, target, item, quality, quantity) => {
        const total = Enums_1.default.values(IItem_1.ItemType).length - 1;
        if (item === exports.ADD_ITEM_ALL) {
            quantity = total;
        }
        for (let i = 0; i < quantity; i++) {
            const addItem = item === exports.ADD_ITEM_ALL ? i + 1 : item === exports.ADD_ITEM_RANDOM ? Random_1.default.int(total) + 1 : item;
            if ("entityType" in target) {
                target.createItemInInventory(addItem, quality);
            }
            else {
                itemManager.create(addItem, target, quality);
            }
        }
        if ("entityType" in target) {
            target.updateTablesAndWeight("M");
        }
        else {
            action.setUpdateView();
        }
        if (InspectDialog_1.default.INSTANCE)
            InspectDialog_1.default.INSTANCE.update();
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQWRkSXRlbVRvSW52ZW50b3J5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2FjdGlvbi9BZGRJdGVtVG9JbnZlbnRvcnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztJQVNhLFFBQUEsZUFBZSxHQUFHLFVBQVUsQ0FBQztJQUM3QixRQUFBLFlBQVksR0FBRyxVQUFVLENBQUM7SUFLdkMsa0JBQWUsSUFBSSxlQUFNLENBQUMsZUFBSyxDQUFDLHdCQUFjLENBQUMsU0FBUyxFQUFFLHdCQUFjLENBQUMsTUFBTSxDQUFDLEVBQUUsd0JBQWMsQ0FBQyxPQUFPLEVBQUUsd0JBQWMsQ0FBQyxPQUFPLEVBQUUsd0JBQWMsQ0FBQyxPQUFPLENBQUM7U0FDdkosV0FBVyxDQUFDLG9CQUFVLENBQUMsTUFBTSxDQUFDO1NBQzlCLGFBQWEsQ0FBQyxHQUFHLDBCQUFnQixDQUFDO1NBQ2xDLFVBQVUsQ0FBQyxDQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUUsSUFBNkQsRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFLEVBQUU7UUFDaEgsTUFBTSxLQUFLLEdBQUcsZUFBSyxDQUFDLE1BQU0sQ0FBQyxnQkFBUSxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztRQUNoRCxJQUFJLElBQUksS0FBSyxvQkFBWSxFQUFFO1lBQzFCLFFBQVEsR0FBRyxLQUFLLENBQUM7U0FDakI7UUFFRCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsUUFBUSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ2xDLE1BQU0sT0FBTyxHQUFHLElBQUksS0FBSyxvQkFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEtBQUssdUJBQWUsQ0FBQyxDQUFDLENBQUMsZ0JBQVksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7WUFDOUcsSUFBSSxZQUFZLElBQUksTUFBTSxFQUFFO2dCQUMzQixNQUFNLENBQUMscUJBQXFCLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO2FBRS9DO2lCQUFNO2dCQUNOLFdBQVcsQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQzthQUM3QztTQUNEO1FBRUQsSUFBSSxZQUFZLElBQUksTUFBTSxFQUFFO1lBQzNCLE1BQU0sQ0FBQyxxQkFBcUIsQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUVsQzthQUFNO1lBQ04sTUFBTSxDQUFDLGFBQWEsRUFBRSxDQUFDO1NBQ3ZCO1FBRUQsSUFBSSx1QkFBYSxDQUFDLFFBQVE7WUFBRSx1QkFBYSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUM3RCxDQUFDLENBQUMsQ0FBQyJ9