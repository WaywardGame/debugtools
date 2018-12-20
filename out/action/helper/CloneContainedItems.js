define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function default_1(from, to) {
        if (!("containedItems" in from) || !("containedItems" in to))
            return;
        for (const item of from.containedItems || []) {
            const clone = itemManager.create(item.type, to, item.quality);
            clone.ownerIdentifier = item.ownerIdentifier;
            clone.minDur = item.minDur;
            clone.maxDur = item.maxDur;
            clone.renamed = item.renamed;
            clone.weight = item.weight;
            clone.weightCapacity = item.weightCapacity;
            clone.legendary = item.legendary && Object.assign({}, item.legendary);
        }
    }
    exports.default = default_1;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2xvbmVDb250YWluZWRJdGVtcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hY3Rpb24vaGVscGVyL0Nsb25lQ29udGFpbmVkSXRlbXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0lBS0EsbUJBQXlCLElBQXlCLEVBQUUsRUFBdUI7UUFDMUUsSUFBSSxDQUFDLENBQUMsZ0JBQWdCLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLGdCQUFnQixJQUFJLEVBQUUsQ0FBQztZQUFFLE9BQU87UUFFckUsS0FBSyxNQUFNLElBQUksSUFBSSxJQUFJLENBQUMsY0FBYyxJQUFJLEVBQUUsRUFBRTtZQUM3QyxNQUFNLEtBQUssR0FBRyxXQUFXLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsRUFBZ0IsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDNUUsS0FBSyxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDO1lBQzdDLEtBQUssQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztZQUMzQixLQUFLLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7WUFDM0IsS0FBSyxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO1lBQzdCLEtBQUssQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztZQUMzQixLQUFLLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUM7WUFDM0MsS0FBSyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxzQkFBUyxJQUFJLENBQUMsU0FBUyxDQUFFLENBQUM7U0FDMUQ7SUFDRixDQUFDO0lBYkQsNEJBYUMifQ==