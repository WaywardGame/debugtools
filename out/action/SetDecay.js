define(["require", "exports", "game/entity/IEntity", "game/entity/action/Action", "game/entity/action/IAction", "../Actions", "../ui/InspectDialog"], function (require, exports, IEntity_1, Action_1, IAction_1, Actions_1, InspectDialog_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.setDecay = void 0;
    exports.default = new Action_1.Action(IAction_1.ActionArgument.Item, IAction_1.ActionArgument.Integer32)
        .setUsableBy(IEntity_1.EntityType.Player)
        .setUsableWhen(...Actions_1.defaultUsability)
        .setHandler((action, item, decay) => setDecay(action, decay, item));
    function setDecay(action, decay, ...items) {
        let owner;
        for (const item of items) {
            owner ??= item.getCurrentOwner();
            if (item.canDecay()) {
                item.decay = decay;
                if (!item.startingDecay || item.decay > item.startingDecay) {
                    item.startingDecay = item.decay;
                }
                oldui.updateItem(item, true);
            }
        }
        if (owner)
            owner.updateTablesAndWeight("M");
        else
            action.setUpdateView();
        InspectDialog_1.default.INSTANCE?.update();
    }
    exports.setDecay = setDecay;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2V0RGVjYXkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvYWN0aW9uL1NldERlY2F5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7SUFZQSxrQkFBZSxJQUFJLGVBQU0sQ0FBQyx3QkFBYyxDQUFDLElBQUksRUFBRSx3QkFBYyxDQUFDLFNBQVMsQ0FBQztTQUN0RSxXQUFXLENBQUMsb0JBQVUsQ0FBQyxNQUFNLENBQUM7U0FDOUIsYUFBYSxDQUFDLEdBQUcsMEJBQWdCLENBQUM7U0FDbEMsVUFBVSxDQUFDLENBQUMsTUFBTSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsRUFBRSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7SUFFckUsU0FBZ0IsUUFBUSxDQUFDLE1BQWlDLEVBQUUsS0FBYSxFQUFFLEdBQUcsS0FBYTtRQUMxRixJQUFJLEtBQXdCLENBQUM7UUFDN0IsS0FBSyxNQUFNLElBQUksSUFBSSxLQUFLLEVBQUU7WUFDekIsS0FBSyxLQUFLLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztZQUNqQyxJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUUsRUFBRTtnQkFDcEIsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7Z0JBQ25CLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxJQUFJLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLGFBQWEsRUFBRTtvQkFDM0QsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO2lCQUNoQztnQkFDRCxLQUFLLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQzthQUM3QjtTQUNEO1FBRUQsSUFBSSxLQUFLO1lBQ1IsS0FBSyxDQUFDLHFCQUFxQixDQUFDLEdBQUcsQ0FBQyxDQUFDOztZQUVqQyxNQUFNLENBQUMsYUFBYSxFQUFFLENBQUM7UUFFeEIsdUJBQWEsQ0FBQyxRQUFRLEVBQUUsTUFBTSxFQUFFLENBQUM7SUFDbEMsQ0FBQztJQW5CRCw0QkFtQkMifQ==