define(["require", "exports", "game/entity/action/Action", "game/entity/action/IAction", "game/entity/Human", "game/entity/IEntity", "game/item/IItem", "utilities/enum/Enums", "../Actions", "../ui/InspectDialog"], function (require, exports, Action_1, IAction_1, Human_1, IEntity_1, IItem_1, Enums_1, Actions_1, InspectDialog_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ADD_ITEM_ALL = exports.ADD_ITEM_RANDOM = void 0;
    exports.ADD_ITEM_RANDOM = 1000000001;
    exports.ADD_ITEM_ALL = 1000000002;
    exports.default = new Action_1.Action(IAction_1.ActionArgument.Container, IAction_1.ActionArgument.Integer32, IAction_1.ActionArgument.Quality, IAction_1.ActionArgument.Integer32)
        .setUsableBy(IEntity_1.EntityType.Player)
        .setUsableWhen(...Actions_1.defaultUsability)
        .setHandler((action, target, item, quality, quantity) => {
        const total = Enums_1.default.values(IItem_1.ItemType).length - 1;
        if (item === exports.ADD_ITEM_ALL) {
            quantity = total;
        }
        const containerObject = action.executor.island.items.resolveContainer(target);
        for (let i = 0; i < quantity; i++) {
            const addItem = item === exports.ADD_ITEM_ALL ? i + 1 : item === exports.ADD_ITEM_RANDOM ? action.executor.island.seededRandom.int(total) + 1 : item;
            if (containerObject instanceof Human_1.default)
                containerObject.createItemInInventory(addItem, quality);
            else
                action.executor.island.items.create(addItem, target, quality);
        }
        if (containerObject instanceof Human_1.default)
            containerObject.updateTablesAndWeight("M");
        else
            action.setUpdateView();
        InspectDialog_1.default.INSTANCE?.update();
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQWRkSXRlbVRvSW52ZW50b3J5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2FjdGlvbi9BZGRJdGVtVG9JbnZlbnRvcnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztJQVNhLFFBQUEsZUFBZSxHQUFHLFVBQVUsQ0FBQztJQUM3QixRQUFBLFlBQVksR0FBRyxVQUFVLENBQUM7SUFLdkMsa0JBQWUsSUFBSSxlQUFNLENBQUMsd0JBQWMsQ0FBQyxTQUFTLEVBQUUsd0JBQWMsQ0FBQyxTQUFTLEVBQUUsd0JBQWMsQ0FBQyxPQUFPLEVBQUUsd0JBQWMsQ0FBQyxTQUFTLENBQUM7U0FDN0gsV0FBVyxDQUFDLG9CQUFVLENBQUMsTUFBTSxDQUFDO1NBQzlCLGFBQWEsQ0FBQyxHQUFHLDBCQUFnQixDQUFDO1NBQ2xDLFVBQVUsQ0FBQyxDQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUUsSUFBNkQsRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFLEVBQUU7UUFDaEgsTUFBTSxLQUFLLEdBQUcsZUFBSyxDQUFDLE1BQU0sQ0FBQyxnQkFBUSxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztRQUNoRCxJQUFJLElBQUksS0FBSyxvQkFBWSxFQUFFO1lBQzFCLFFBQVEsR0FBRyxLQUFLLENBQUM7U0FDakI7UUFFRCxNQUFNLGVBQWUsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDOUUsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFFBQVEsRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUNsQyxNQUFNLE9BQU8sR0FBRyxJQUFJLEtBQUssb0JBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxLQUFLLHVCQUFlLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7WUFDckksSUFBSSxlQUFlLFlBQVksZUFBSztnQkFDbkMsZUFBZSxDQUFDLHFCQUFxQixDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQzs7Z0JBRXhELE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQztTQUMvRDtRQUVELElBQUksZUFBZSxZQUFZLGVBQUs7WUFDbkMsZUFBZSxDQUFDLHFCQUFxQixDQUFDLEdBQUcsQ0FBQyxDQUFDOztZQUUzQyxNQUFNLENBQUMsYUFBYSxFQUFFLENBQUM7UUFFeEIsdUJBQWEsQ0FBQyxRQUFRLEVBQUUsTUFBTSxFQUFFLENBQUM7SUFDbEMsQ0FBQyxDQUFDLENBQUMifQ==