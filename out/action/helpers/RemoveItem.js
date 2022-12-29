define(["require", "exports", "../../ui/InspectDialog"], function (require, exports, InspectDialog_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function default_1(action, item) {
        const container = item.containedWithin;
        action.executor.island.items.remove(item);
        if (container) {
            if ("data" in container) {
                action.setUpdateView();
            }
            else if ("entityType" in container) {
                const entity = container;
                entity.asPlayer?.updateTablesAndWeight("M");
            }
        }
        InspectDialog_1.default.INSTANCE?.update();
    }
    exports.default = default_1;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVtb3ZlSXRlbS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hY3Rpb24vaGVscGVycy9SZW1vdmVJdGVtLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztJQU1BLG1CQUF5QixNQUEwQixFQUFFLElBQVU7UUFDOUQsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQztRQUN2QyxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRTFDLElBQUksU0FBUyxFQUFFO1lBQ2QsSUFBSSxNQUFNLElBQUksU0FBUyxFQUFFO2dCQUN4QixNQUFNLENBQUMsYUFBYSxFQUFFLENBQUM7YUFFdkI7aUJBQU0sSUFBSSxZQUFZLElBQUksU0FBUyxFQUFFO2dCQUNyQyxNQUFNLE1BQU0sR0FBRyxTQUEwQixDQUFDO2dCQUMxQyxNQUFNLENBQUMsUUFBUSxFQUFFLHFCQUFxQixDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQzVDO1NBQ0Q7UUFFRCx1QkFBYSxDQUFDLFFBQVEsRUFBRSxNQUFNLEVBQUUsQ0FBQztJQUNsQyxDQUFDO0lBZkQsNEJBZUMifQ==