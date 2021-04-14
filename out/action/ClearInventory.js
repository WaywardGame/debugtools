define(["require", "exports", "game/entity/action/Action", "game/entity/action/IAction", "game/entity/IEntity", "../Actions", "../ui/InspectDialog"], function (require, exports, Action_1, IAction_1, IEntity_1, Actions_1, InspectDialog_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = new Action_1.Action(IAction_1.anyOf(IAction_1.ActionArgument.Container, IAction_1.ActionArgument.Human))
        .setUsableBy(IEntity_1.EntityType.Player)
        .setUsableWhen(...Actions_1.defaultUsability)
        .setHandler((action, target) => {
        var _a;
        const inventory = "entityType" in target ? target.inventory : target;
        itemManager.removeContainerItems(inventory, true);
        if ("entityType" in target) {
            (_a = target.asPlayer) === null || _a === void 0 ? void 0 : _a.updateTablesAndWeight("M");
        }
        else {
            action.setUpdateView();
        }
        if (InspectDialog_1.default.INSTANCE)
            InspectDialog_1.default.INSTANCE.update();
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2xlYXJJbnZlbnRvcnkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvYWN0aW9uL0NsZWFySW52ZW50b3J5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztJQVNBLGtCQUFlLElBQUksZUFBTSxDQUFDLGVBQUssQ0FBQyx3QkFBYyxDQUFDLFNBQVMsRUFBRSx3QkFBYyxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQzlFLFdBQVcsQ0FBQyxvQkFBVSxDQUFDLE1BQU0sQ0FBQztTQUM5QixhQUFhLENBQUMsR0FBRywwQkFBZ0IsQ0FBQztTQUNsQyxVQUFVLENBQUMsQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLEVBQUU7O1FBQzlCLE1BQU0sU0FBUyxHQUFHLFlBQVksSUFBSSxNQUFNLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQztRQUNyRSxXQUFXLENBQUMsb0JBQW9CLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBRWxELElBQUksWUFBWSxJQUFJLE1BQU0sRUFBRTtZQUMzQixNQUFBLE1BQU0sQ0FBQyxRQUFRLDBDQUFFLHFCQUFxQixDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBRTVDO2FBQU07WUFDTixNQUFNLENBQUMsYUFBYSxFQUFFLENBQUM7U0FDdkI7UUFFRCxJQUFJLHVCQUFhLENBQUMsUUFBUTtZQUFFLHVCQUFhLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDO0lBQzdELENBQUMsQ0FBQyxDQUFDIn0=