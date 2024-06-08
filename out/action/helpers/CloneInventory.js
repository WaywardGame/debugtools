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
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
    function default_1(from, to) {
        for (const item of [...to.inventory.containedItems]) {
            if (item.isContainer()) {
                to.island.items.removeContainerItems(item);
            }
            to.island.items.remove(item);
        }
        for (const item of [...to.getEquippedItems()]) {
            to.island.items.remove(item);
        }
        for (const item of from.inventory.containedItems) {
            const clone = to.cloneItemIntoInventory(item);
            if (item.isEquipped())
                to.equip(clone, item.getEquipSlot());
        }
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2xvbmVJbnZlbnRvcnkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYWN0aW9uL2hlbHBlcnMvQ2xvbmVJbnZlbnRvcnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7OztHQVNHOzs7O0lBT0gsNEJBaUJDO0lBakJELG1CQUF5QixJQUFXLEVBQUUsRUFBUztRQUM5QyxLQUFLLE1BQU0sSUFBSSxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxFQUFFLENBQUM7WUFDckQsSUFBSSxJQUFJLENBQUMsV0FBVyxFQUFFLEVBQUUsQ0FBQztnQkFDeEIsRUFBRSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDNUMsQ0FBQztZQUVELEVBQUUsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM5QixDQUFDO1FBRUQsS0FBSyxNQUFNLElBQUksSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLGdCQUFnQixFQUFFLENBQUMsRUFBRSxDQUFDO1lBQy9DLEVBQUUsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM5QixDQUFDO1FBRUQsS0FBSyxNQUFNLElBQUksSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLGNBQWMsRUFBRSxDQUFDO1lBQ2xELE1BQU0sS0FBSyxHQUFHLEVBQUUsQ0FBQyxzQkFBc0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUM5QyxJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUU7Z0JBQUUsRUFBRSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLFlBQVksRUFBRyxDQUFDLENBQUM7UUFDOUQsQ0FBQztJQUNGLENBQUMifQ==