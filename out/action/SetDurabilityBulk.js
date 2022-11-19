define(["require", "exports", "game/entity/action/Action", "game/entity/action/IAction", "game/entity/Human", "game/entity/IEntity", "../Actions", "../ui/InspectDialog"], function (require, exports, Action_1, IAction_1, Human_1, IEntity_1, Actions_1, InspectDialog_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = new Action_1.Action(IAction_1.ActionArgument.Container, IAction_1.ActionArgument.Integer32)
        .setUsableBy(IEntity_1.EntityType.Player)
        .setUsableWhen(...Actions_1.defaultUsability)
        .setHandler((action, target, durability) => {
        let island;
        for (const item of target.containedItems) {
            island ??= item.island;
            item.durability = durability;
        }
        const containerObject = island?.items.resolveContainer(target);
        if (containerObject instanceof Human_1.default)
            containerObject.updateTablesAndWeight("M");
        else
            action.setUpdateView();
        oldui.syncItemElements(target.containedItems.map(item => item.id));
        InspectDialog_1.default.INSTANCE?.update();
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2V0RHVyYWJpbGl0eUJ1bGsuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvYWN0aW9uL1NldER1cmFiaWxpdHlCdWxrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztJQVdBLGtCQUFlLElBQUksZUFBTSxDQUFDLHdCQUFjLENBQUMsU0FBUyxFQUFFLHdCQUFjLENBQUMsU0FBUyxDQUFDO1NBQzNFLFdBQVcsQ0FBQyxvQkFBVSxDQUFDLE1BQU0sQ0FBQztTQUM5QixhQUFhLENBQUMsR0FBRywwQkFBZ0IsQ0FBQztTQUNsQyxVQUFVLENBQUMsQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxFQUFFO1FBQzFDLElBQUksTUFBMEIsQ0FBQztRQUMvQixLQUFLLE1BQU0sSUFBSSxJQUFJLE1BQU0sQ0FBQyxjQUFjLEVBQUU7WUFDekMsTUFBTSxLQUFLLElBQUksQ0FBQyxNQUFNLENBQUM7WUFDdkIsSUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUM7U0FDN0I7UUFFRCxNQUFNLGVBQWUsR0FBRyxNQUFNLEVBQUUsS0FBSyxDQUFDLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQy9ELElBQUksZUFBZSxZQUFZLGVBQUs7WUFDbkMsZUFBZSxDQUFDLHFCQUFxQixDQUFDLEdBQUcsQ0FBQyxDQUFDOztZQUUzQyxNQUFNLENBQUMsYUFBYSxFQUFFLENBQUM7UUFFeEIsS0FBSyxDQUFDLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFFbkUsdUJBQWEsQ0FBQyxRQUFRLEVBQUUsTUFBTSxFQUFFLENBQUM7SUFDbEMsQ0FBQyxDQUFDLENBQUMifQ==