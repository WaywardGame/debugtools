define(["require", "exports", "../../ui/InspectDialog"], function (require, exports, InspectDialog_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function default_1(action, item) {
        var _a;
        const container = item.containedWithin;
        itemManager.remove(item);
        if (container) {
            if ("data" in container) {
                action.setUpdateView();
            }
            else if ("entityType" in container) {
                const entity = container;
                (_a = entity.asPlayer) === null || _a === void 0 ? void 0 : _a.updateTablesAndWeight("M");
            }
        }
        if (InspectDialog_1.default.INSTANCE)
            InspectDialog_1.default.INSTANCE.update();
    }
    exports.default = default_1;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVtb3ZlSXRlbS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hY3Rpb24vaGVscGVycy9SZW1vdmVJdGVtLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztJQU1BLG1CQUF5QixNQUEwQixFQUFFLElBQVU7O1FBQzlELE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUM7UUFDdkMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUV6QixJQUFJLFNBQVMsRUFBRTtZQUNkLElBQUksTUFBTSxJQUFJLFNBQVMsRUFBRTtnQkFDeEIsTUFBTSxDQUFDLGFBQWEsRUFBRSxDQUFDO2FBRXZCO2lCQUFNLElBQUksWUFBWSxJQUFJLFNBQVMsRUFBRTtnQkFDckMsTUFBTSxNQUFNLEdBQUcsU0FBbUIsQ0FBQztnQkFDbkMsTUFBQSxNQUFNLENBQUMsUUFBUSwwQ0FBRSxxQkFBcUIsQ0FBQyxHQUFHLENBQUMsQ0FBQzthQUM1QztTQUNEO1FBRUQsSUFBSSx1QkFBYSxDQUFDLFFBQVE7WUFBRSx1QkFBYSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUM3RCxDQUFDO0lBZkQsNEJBZUMifQ==