define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function default_1(from, to) {
        var _a, _b;
        for (const item of to.inventory.containedItems) {
            itemManager.remove(item);
        }
        for (const item of to.getEquippedItems()) {
            itemManager.remove(item);
        }
        for (const item of from.inventory.containedItems) {
            const clone = to.createItemInInventory(item.type, item.quality);
            clone.ownerIdentifier = item.ownerIdentifier;
            (_a = game.notifier) === null || _a === void 0 ? void 0 : _a.suspend();
            clone.minDur = item.minDur;
            (_b = game.notifier) === null || _b === void 0 ? void 0 : _b.resume();
            clone.maxDur = item.maxDur;
            clone.renamed = item.renamed;
            clone.weight = item.weight;
            clone.weightCapacity = item.weightCapacity;
            clone.magic.inherit(item.magic);
            if (item.isEquipped())
                to.equip(clone, item.getEquipSlot());
        }
    }
    exports.default = default_1;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2xvbmVJbnZlbnRvcnkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYWN0aW9uL2hlbHBlcnMvQ2xvbmVJbnZlbnRvcnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0lBS0EsbUJBQXlCLElBQVcsRUFBRSxFQUFTOztRQUM5QyxLQUFLLE1BQU0sSUFBSSxJQUFJLEVBQUUsQ0FBQyxTQUFTLENBQUMsY0FBYyxFQUFFO1lBQy9DLFdBQVcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDekI7UUFFRCxLQUFLLE1BQU0sSUFBSSxJQUFJLEVBQUUsQ0FBQyxnQkFBZ0IsRUFBRSxFQUFFO1lBQ3pDLFdBQVcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDekI7UUFFRCxLQUFLLE1BQU0sSUFBSSxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsY0FBYyxFQUFFO1lBQ2pELE1BQU0sS0FBSyxHQUFHLEVBQUUsQ0FBQyxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUNoRSxLQUFLLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUM7WUFDN0MsTUFBQSxJQUFJLENBQUMsUUFBUSwwQ0FBRSxPQUFPLEdBQUc7WUFDekIsS0FBSyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO1lBQzNCLE1BQUEsSUFBSSxDQUFDLFFBQVEsMENBQUUsTUFBTSxHQUFHO1lBQ3hCLEtBQUssQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztZQUMzQixLQUFLLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7WUFDN0IsS0FBSyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO1lBQzNCLEtBQUssQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQztZQUMzQyxLQUFLLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDaEMsSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFO2dCQUFFLEVBQUUsQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxZQUFZLEVBQUcsQ0FBQyxDQUFDO1NBQzdEO0lBQ0YsQ0FBQztJQXRCRCw0QkFzQkMifQ==