define(["require", "exports", "game/entity/action/Action", "game/entity/action/IAction", "game/entity/Human", "game/entity/IEntity", "../Actions", "../ui/InspectDialog"], function (require, exports, Action_1, IAction_1, Human_1, IEntity_1, Actions_1, InspectDialog_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = new Action_1.Action(IAction_1.ActionArgument.Container, IAction_1.ActionArgument.Integer32)
        .setUsableBy(IEntity_1.EntityType.Player)
        .setUsableWhen(...Actions_1.defaultUsability)
        .setHandler((action, target, decay) => {
        let island;
        for (const item of target.containedItems) {
            island ??= item.island;
            item.decay = decay;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2V0RGVjYXlCdWxrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2FjdGlvbi9TZXREZWNheUJ1bGsudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0lBV0Esa0JBQWUsSUFBSSxlQUFNLENBQUMsd0JBQWMsQ0FBQyxTQUFTLEVBQUUsd0JBQWMsQ0FBQyxTQUFTLENBQUM7U0FDM0UsV0FBVyxDQUFDLG9CQUFVLENBQUMsTUFBTSxDQUFDO1NBQzlCLGFBQWEsQ0FBQyxHQUFHLDBCQUFnQixDQUFDO1NBQ2xDLFVBQVUsQ0FBQyxDQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLEVBQUU7UUFDckMsSUFBSSxNQUEwQixDQUFDO1FBQy9CLEtBQUssTUFBTSxJQUFJLElBQUksTUFBTSxDQUFDLGNBQWMsRUFBRTtZQUN6QyxNQUFNLEtBQUssSUFBSSxDQUFDLE1BQU0sQ0FBQztZQUN2QixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztTQUNuQjtRQUVELE1BQU0sZUFBZSxHQUFHLE1BQU0sRUFBRSxLQUFLLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDL0QsSUFBSSxlQUFlLFlBQVksZUFBSztZQUNuQyxlQUFlLENBQUMscUJBQXFCLENBQUMsR0FBRyxDQUFDLENBQUM7O1lBRTNDLE1BQU0sQ0FBQyxhQUFhLEVBQUUsQ0FBQztRQUV4QixLQUFLLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUVuRSx1QkFBYSxDQUFDLFFBQVEsRUFBRSxNQUFNLEVBQUUsQ0FBQztJQUNsQyxDQUFDLENBQUMsQ0FBQyJ9