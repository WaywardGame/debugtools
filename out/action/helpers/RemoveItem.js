define(["require", "exports", "entity/Entity", "entity/IEntity", "../../ui/InspectDialog"], function (require, exports, Entity_1, IEntity_1, InspectDialog_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function default_1(action, item) {
        const container = item.containedWithin;
        itemManager.remove(item);
        if (container) {
            if ("data" in container) {
                action.setUpdateView();
            }
            else if ("entityType" in container) {
                const entity = container;
                if (Entity_1.default.is(entity, IEntity_1.EntityType.Player)) {
                    entity.updateTablesAndWeight();
                }
            }
        }
        if (InspectDialog_1.default.INSTANCE)
            InspectDialog_1.default.INSTANCE.update();
    }
    exports.default = default_1;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVtb3ZlSXRlbS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hY3Rpb24vaGVscGVycy9SZW1vdmVJdGVtLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztJQU9BLG1CQUF5QixNQUEyQixFQUFFLElBQVc7UUFDaEUsTUFBTSxTQUFTLEdBQUcsSUFBSyxDQUFDLGVBQWUsQ0FBQztRQUN4QyxXQUFXLENBQUMsTUFBTSxDQUFDLElBQUssQ0FBQyxDQUFDO1FBRTFCLElBQUksU0FBUyxFQUFFO1lBQ2QsSUFBSSxNQUFNLElBQUksU0FBUyxFQUFFO2dCQUN4QixNQUFNLENBQUMsYUFBYSxFQUFFLENBQUM7YUFFdkI7aUJBQU0sSUFBSSxZQUFZLElBQUksU0FBUyxFQUFFO2dCQUNyQyxNQUFNLE1BQU0sR0FBRyxTQUFvQixDQUFDO2dCQUNwQyxJQUFJLGdCQUFNLENBQUMsRUFBRSxDQUFDLE1BQU0sRUFBRSxvQkFBVSxDQUFDLE1BQU0sQ0FBQyxFQUFFO29CQUN6QyxNQUFNLENBQUMscUJBQXFCLEVBQUUsQ0FBQztpQkFDL0I7YUFDRDtTQUNEO1FBRUQsSUFBSSx1QkFBYSxDQUFDLFFBQVE7WUFBRSx1QkFBYSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUM3RCxDQUFDO0lBakJELDRCQWlCQyJ9