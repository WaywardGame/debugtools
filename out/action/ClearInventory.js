define(["require", "exports", "game/entity/action/Action", "game/entity/action/IAction", "game/entity/IEntity", "../Actions", "../ui/InspectDialog"], function (require, exports, Action_1, IAction_1, IEntity_1, Actions_1, InspectDialog_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = new Action_1.Action((0, IAction_1.anyOf)(IAction_1.ActionArgument.Container, IAction_1.ActionArgument.Human))
        .setUsableBy(IEntity_1.EntityType.Player)
        .setUsableWhen(...Actions_1.defaultUsability)
        .setHandler((action, target) => {
        var _a;
        const inventory = "entityType" in target ? target.inventory : target;
        action.executor.island.items.removeContainerItems(inventory, true);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2xlYXJJbnZlbnRvcnkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvYWN0aW9uL0NsZWFySW52ZW50b3J5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztJQVNBLGtCQUFlLElBQUksZUFBTSxDQUFDLElBQUEsZUFBSyxFQUFDLHdCQUFjLENBQUMsU0FBUyxFQUFFLHdCQUFjLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDOUUsV0FBVyxDQUFDLG9CQUFVLENBQUMsTUFBTSxDQUFDO1NBQzlCLGFBQWEsQ0FBQyxHQUFHLDBCQUFnQixDQUFDO1NBQ2xDLFVBQVUsQ0FBQyxDQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUUsRUFBRTs7UUFDOUIsTUFBTSxTQUFTLEdBQUcsWUFBWSxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDO1FBQ3JFLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxvQkFBb0IsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFFbkUsSUFBSSxZQUFZLElBQUksTUFBTSxFQUFFO1lBQzNCLE1BQUEsTUFBTSxDQUFDLFFBQVEsMENBQUUscUJBQXFCLENBQUMsR0FBRyxDQUFDLENBQUM7U0FFNUM7YUFBTTtZQUNOLE1BQU0sQ0FBQyxhQUFhLEVBQUUsQ0FBQztTQUN2QjtRQUVELElBQUksdUJBQWEsQ0FBQyxRQUFRO1lBQUUsdUJBQWEsQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUM7SUFDN0QsQ0FBQyxDQUFDLENBQUMifQ==