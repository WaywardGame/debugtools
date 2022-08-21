define(["require", "exports", "game/entity/action/Action", "game/entity/action/IAction", "game/entity/IEntity", "game/item/IItem", "utilities/enum/Enums", "../Actions", "../ui/InspectDialog"], function (require, exports, Action_1, IAction_1, IEntity_1, IItem_1, Enums_1, Actions_1, InspectDialog_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ADD_ITEM_ALL = exports.ADD_ITEM_RANDOM = void 0;
    exports.ADD_ITEM_RANDOM = 1000000001;
    exports.ADD_ITEM_ALL = 1000000002;
    exports.default = new Action_1.Action((0, IAction_1.anyOf)(IAction_1.ActionArgument.Container, IAction_1.ActionArgument.Player), IAction_1.ActionArgument.Integer32, IAction_1.ActionArgument.Quality, IAction_1.ActionArgument.Integer32)
        .setUsableBy(IEntity_1.EntityType.Player)
        .setUsableWhen(...Actions_1.defaultUsability)
        .setHandler((action, target, item, quality, quantity) => {
        const total = Enums_1.default.values(IItem_1.ItemType).length - 1;
        if (item === exports.ADD_ITEM_ALL) {
            quantity = total;
        }
        for (let i = 0; i < quantity; i++) {
            const addItem = item === exports.ADD_ITEM_ALL ? i + 1 : item === exports.ADD_ITEM_RANDOM ? action.executor.island.seededRandom.int(total) + 1 : item;
            if ("entityType" in target) {
                target.createItemInInventory(addItem, quality);
            }
            else {
                action.executor.island.items.create(addItem, target, quality);
            }
        }
        if ("entityType" in target) {
            target.updateTablesAndWeight("M");
        }
        else {
            action.setUpdateView();
        }
        InspectDialog_1.default.INSTANCE?.update();
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQWRkSXRlbVRvSW52ZW50b3J5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2FjdGlvbi9BZGRJdGVtVG9JbnZlbnRvcnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztJQVFhLFFBQUEsZUFBZSxHQUFHLFVBQVUsQ0FBQztJQUM3QixRQUFBLFlBQVksR0FBRyxVQUFVLENBQUM7SUFLdkMsa0JBQWUsSUFBSSxlQUFNLENBQUMsSUFBQSxlQUFLLEVBQUMsd0JBQWMsQ0FBQyxTQUFTLEVBQUUsd0JBQWMsQ0FBQyxNQUFNLENBQUMsRUFBRSx3QkFBYyxDQUFDLFNBQVMsRUFBRSx3QkFBYyxDQUFDLE9BQU8sRUFBRSx3QkFBYyxDQUFDLFNBQVMsQ0FBQztTQUMzSixXQUFXLENBQUMsb0JBQVUsQ0FBQyxNQUFNLENBQUM7U0FDOUIsYUFBYSxDQUFDLEdBQUcsMEJBQWdCLENBQUM7U0FDbEMsVUFBVSxDQUFDLENBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRSxJQUE2RCxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUUsRUFBRTtRQUNoSCxNQUFNLEtBQUssR0FBRyxlQUFLLENBQUMsTUFBTSxDQUFDLGdCQUFRLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO1FBQ2hELElBQUksSUFBSSxLQUFLLG9CQUFZLEVBQUU7WUFDMUIsUUFBUSxHQUFHLEtBQUssQ0FBQztTQUNqQjtRQUVELEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxRQUFRLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDbEMsTUFBTSxPQUFPLEdBQUcsSUFBSSxLQUFLLG9CQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksS0FBSyx1QkFBZSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO1lBQ3JJLElBQUksWUFBWSxJQUFJLE1BQU0sRUFBRTtnQkFDM0IsTUFBTSxDQUFDLHFCQUFxQixDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQzthQUUvQztpQkFBTTtnQkFDTixNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUM7YUFDOUQ7U0FDRDtRQUVELElBQUksWUFBWSxJQUFJLE1BQU0sRUFBRTtZQUMzQixNQUFNLENBQUMscUJBQXFCLENBQUMsR0FBRyxDQUFDLENBQUM7U0FFbEM7YUFBTTtZQUNOLE1BQU0sQ0FBQyxhQUFhLEVBQUUsQ0FBQztTQUN2QjtRQUVELHVCQUFhLENBQUMsUUFBUSxFQUFFLE1BQU0sRUFBRSxDQUFDO0lBQ2xDLENBQUMsQ0FBQyxDQUFDIn0=