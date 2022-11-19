define(["require", "exports", "game/entity/action/Action", "game/entity/action/IAction", "game/entity/Human", "game/entity/IEntity", "../Actions", "../ui/InspectDialog"], function (require, exports, Action_1, IAction_1, Human_1, IEntity_1, Actions_1, InspectDialog_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = new Action_1.Action(IAction_1.ActionArgument.Container)
        .setUsableBy(IEntity_1.EntityType.Player)
        .setUsableWhen(...Actions_1.defaultUsability)
        .setHandler((action, container) => {
        action.executor.island.items.removeContainerItems(container, true);
        const containerObject = action.executor.island?.items.resolveContainer(container);
        if (containerObject instanceof Human_1.default)
            containerObject.updateTablesAndWeight("M");
        else
            action.setUpdateView();
        InspectDialog_1.default.INSTANCE?.update();
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2xlYXJJbnZlbnRvcnkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvYWN0aW9uL0NsZWFySW52ZW50b3J5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztJQVVBLGtCQUFlLElBQUksZUFBTSxDQUFDLHdCQUFjLENBQUMsU0FBUyxDQUFDO1NBQ2pELFdBQVcsQ0FBQyxvQkFBVSxDQUFDLE1BQU0sQ0FBQztTQUM5QixhQUFhLENBQUMsR0FBRywwQkFBZ0IsQ0FBQztTQUNsQyxVQUFVLENBQUMsQ0FBQyxNQUFNLEVBQUUsU0FBUyxFQUFFLEVBQUU7UUFDakMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLG9CQUFvQixDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUVuRSxNQUFNLGVBQWUsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDbEYsSUFBSSxlQUFlLFlBQVksZUFBSztZQUNuQyxlQUFlLENBQUMscUJBQXFCLENBQUMsR0FBRyxDQUFDLENBQUM7O1lBRTNDLE1BQU0sQ0FBQyxhQUFhLEVBQUUsQ0FBQztRQUV4Qix1QkFBYSxDQUFDLFFBQVEsRUFBRSxNQUFNLEVBQUUsQ0FBQztJQUNsQyxDQUFDLENBQUMsQ0FBQyJ9