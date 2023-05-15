/*!
 * Copyright 2011-2023 Unlok
 * https://www.unlok.ca
 *
 * Credits & Thanks:
 * https://www.unlok.ca/credits-thanks/
 *
 * Wayward is a copyrighted and licensed work. Modification and/or distribution of any source files is prohibited. If you wish to modify the game in any way, please refer to the modding guide:
 * https://github.com/WaywardGame/types/wiki
 */
define(["require", "exports", "game/magic/MagicalPropertyManager"], function (require, exports, MagicalPropertyManager_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function default_1(from, to) {
        for (const item of [...to.inventory.containedItems]) {
            from.island.items.remove(item);
        }
        for (const item of [...to.getEquippedItems()]) {
            to.island.items.remove(item);
        }
        for (const item of from.inventory.containedItems) {
            const clone = to.createItemInInventory(item.type, item.quality);
            clone.crafterIdentifier = item.crafterIdentifier;
            renderers.notifier.suspend();
            clone.durability = item.durability;
            renderers.notifier.resume();
            clone.durabilityMax = item.durabilityMax;
            clone.renamed = item.renamed;
            clone.weight = item.weight;
            MagicalPropertyManager_1.default.inherit(item, clone);
            if (item.isEquipped())
                to.equip(clone, item.getEquipSlot());
        }
    }
    exports.default = default_1;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2xvbmVJbnZlbnRvcnkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYWN0aW9uL2hlbHBlcnMvQ2xvbmVJbnZlbnRvcnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7OztHQVNHOzs7O0lBUUgsbUJBQXlCLElBQVcsRUFBRSxFQUFTO1FBQzlDLEtBQUssTUFBTSxJQUFJLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLEVBQUU7WUFDcEQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQy9CO1FBRUQsS0FBSyxNQUFNLElBQUksSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLGdCQUFnQixFQUFFLENBQUMsRUFBRTtZQUM5QyxFQUFFLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDN0I7UUFFRCxLQUFLLE1BQU0sSUFBSSxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsY0FBYyxFQUFFO1lBQ2pELE1BQU0sS0FBSyxHQUFHLEVBQUUsQ0FBQyxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUNoRSxLQUFLLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDO1lBQ2pELFNBQVMsQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDN0IsS0FBSyxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDO1lBQ25DLFNBQVMsQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUM7WUFDNUIsS0FBSyxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDO1lBQ3pDLEtBQUssQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztZQUM3QixLQUFLLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7WUFDM0IsZ0NBQXNCLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztZQUM1QyxJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUU7Z0JBQUUsRUFBRSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLFlBQVksRUFBRyxDQUFDLENBQUM7U0FDN0Q7SUFDRixDQUFDO0lBckJELDRCQXFCQyJ9