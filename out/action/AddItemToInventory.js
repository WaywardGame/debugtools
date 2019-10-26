define(["require", "exports", "entity/action/Action", "entity/action/IAction", "entity/Entity", "entity/IEntity", "entity/player/Player", "../Actions", "../ui/InspectDialog"], function (require, exports, Action_1, IAction_1, Entity_1, IEntity_1, Player_1, Actions_1, InspectDialog_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = new Action_1.Action(IAction_1.anyOf(IAction_1.ActionArgument.Container, IAction_1.ActionArgument.Player), IAction_1.ActionArgument.ItemType, IAction_1.ActionArgument.Quality)
        .setUsableBy(IEntity_1.EntityType.Player)
        .setUsableWhen(...Actions_1.defaultUsability)
        .setHandler((action, target, item, quality) => {
        if (target instanceof Player_1.default) {
            target.createItemInInventory(item, quality);
            if (Entity_1.default.is(target, IEntity_1.EntityType.Player)) {
                target.updateTablesAndWeight();
            }
        }
        else {
            itemManager.create(item, target, quality);
            action.setUpdateView();
        }
        if (InspectDialog_1.default.INSTANCE)
            InspectDialog_1.default.INSTANCE.update();
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQWRkSXRlbVRvSW52ZW50b3J5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2FjdGlvbi9BZGRJdGVtVG9JbnZlbnRvcnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0lBWUEsa0JBQWUsSUFBSSxlQUFNLENBQUMsZUFBSyxDQUFDLHdCQUFjLENBQUMsU0FBUyxFQUFFLHdCQUFjLENBQUMsTUFBTSxDQUFDLEVBQUUsd0JBQWMsQ0FBQyxRQUFRLEVBQUUsd0JBQWMsQ0FBQyxPQUFPLENBQUM7U0FDaEksV0FBVyxDQUFDLG9CQUFVLENBQUMsTUFBTSxDQUFDO1NBQzlCLGFBQWEsQ0FBQyxHQUFHLDBCQUFnQixDQUFDO1NBQ2xDLFVBQVUsQ0FBQyxDQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxFQUFFO1FBQzdDLElBQUksTUFBTSxZQUFZLGdCQUFNLEVBQUU7WUFDN0IsTUFBTSxDQUFDLHFCQUFxQixDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztZQUU1QyxJQUFJLGdCQUFNLENBQUMsRUFBRSxDQUFDLE1BQU0sRUFBRSxvQkFBVSxDQUFDLE1BQU0sQ0FBQyxFQUFFO2dCQUN6QyxNQUFNLENBQUMscUJBQXFCLEVBQUUsQ0FBQzthQUMvQjtTQUVEO2FBQU07WUFDTixXQUFXLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxNQUFvQixFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBQ3hELE1BQU0sQ0FBQyxhQUFhLEVBQUUsQ0FBQztTQUN2QjtRQUVELElBQUksdUJBQWEsQ0FBQyxRQUFRO1lBQUUsdUJBQWEsQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUM7SUFDN0QsQ0FBQyxDQUFDLENBQUMifQ==