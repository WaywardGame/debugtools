define(["require", "exports", "../../DebugTools", "../../IDebugTools", "../component/InspectInformationSection"], function (require, exports, DebugTools_1, IDebugTools_1, InspectInformationSection_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class ItemInformation extends InspectInformationSection_1.default {
        constructor(api) {
            super(api);
            this.items = [];
        }
        getTabs() {
            return this.items.length ? [
                [0, DebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.TabItemStack)],
            ] : [];
        }
        update(position, tile) {
            this.items = tile.containedItems || [];
            if (this.items.length) {
                DebugTools_1.default.LOG.info("Items:", tile.containedItems);
            }
            return this;
        }
    }
    exports.default = ItemInformation;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSXRlbS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy91aS9pbnNwZWN0L0l0ZW0udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0lBUUEsTUFBcUIsZUFBZ0IsU0FBUSxtQ0FBeUI7UUFHckUsWUFBbUIsR0FBVTtZQUM1QixLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7WUFISixVQUFLLEdBQVksRUFBRSxDQUFDO1FBSTVCLENBQUM7UUFFTSxPQUFPO1lBQ2IsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQzFCLENBQUMsQ0FBQyxFQUFFLHdCQUFXLENBQUMsbUNBQXFCLENBQUMsWUFBWSxDQUFDLENBQUM7YUFDcEQsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO1FBQ1IsQ0FBQztRQUVNLE1BQU0sQ0FBQyxRQUFrQixFQUFFLElBQVc7WUFDNUMsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsY0FBYyxJQUFJLEVBQUUsQ0FBQztZQUV2QyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFO2dCQUN0QixvQkFBVSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQzthQUNuRDtZQUVELE9BQU8sSUFBSSxDQUFDO1FBQ2IsQ0FBQztLQUNEO0lBdEJELGtDQXNCQyJ9