define(["require", "exports", "game/entity/IEntity", "game/entity/action/Action", "game/entity/action/IAction", "../Actions", "../ui/InspectDialog"], function (require, exports, IEntity_1, Action_1, IAction_1, Actions_1, InspectDialog_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.setDurability = void 0;
    exports.default = new Action_1.Action(IAction_1.ActionArgument.Item, IAction_1.ActionArgument.Float64)
        .setUsableBy(IEntity_1.EntityType.Player)
        .setUsableWhen(...Actions_1.defaultUsability)
        .setHandler((action, item, durability) => setDurability(action, durability, item));
    function setDurability(action, durability, ...items) {
        let human;
        for (const item of items) {
            human ??= item.getCurrentOwner();
            item.durability = Number.isInteger(durability) || durability > 1 ? durability : Math.ceil((item.durabilityMax ?? 1) * durability);
            oldui.updateItem(item, true);
        }
        if (human)
            human.updateTablesAndWeight("M");
        else
            action.setUpdateView();
        InspectDialog_1.default.INSTANCE?.update();
    }
    exports.setDurability = setDurability;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2V0RHVyYWJpbGl0eS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hY3Rpb24vU2V0RHVyYWJpbGl0eS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0lBWUEsa0JBQWUsSUFBSSxlQUFNLENBQUMsd0JBQWMsQ0FBQyxJQUFJLEVBQUUsd0JBQWMsQ0FBQyxPQUFPLENBQUM7U0FDcEUsV0FBVyxDQUFDLG9CQUFVLENBQUMsTUFBTSxDQUFDO1NBQzlCLGFBQWEsQ0FBQyxHQUFHLDBCQUFnQixDQUFDO1NBQ2xDLFVBQVUsQ0FBQyxDQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLEVBQUUsQ0FBQyxhQUFhLENBQUMsTUFBTSxFQUFFLFVBQVUsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBRXBGLFNBQWdCLGFBQWEsQ0FBQyxNQUFpQyxFQUFFLFVBQWtCLEVBQUUsR0FBRyxLQUFhO1FBQ3BHLElBQUksS0FBd0IsQ0FBQztRQUM3QixLQUFLLE1BQU0sSUFBSSxJQUFJLEtBQUssRUFBRTtZQUN6QixLQUFLLEtBQUssSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO1lBQ2pDLElBQUksQ0FBQyxVQUFVLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsSUFBSSxVQUFVLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsYUFBYSxJQUFJLENBQUMsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxDQUFDO1lBRWxJLEtBQUssQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1NBQzdCO1FBRUQsSUFBSSxLQUFLO1lBQ1IsS0FBSyxDQUFDLHFCQUFxQixDQUFDLEdBQUcsQ0FBQyxDQUFDOztZQUVqQyxNQUFNLENBQUMsYUFBYSxFQUFFLENBQUM7UUFFeEIsdUJBQWEsQ0FBQyxRQUFRLEVBQUUsTUFBTSxFQUFFLENBQUM7SUFDbEMsQ0FBQztJQWZELHNDQWVDIn0=