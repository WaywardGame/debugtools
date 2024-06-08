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
    function default_1(island, from, to) {
        if (!("containedItems" in from) || !("containedItems" in to))
            return;
        for (const item of from.containedItems || []) {
            const clone = island.items.create(item.type, to, item.quality);
            clone.copyPropertiesFrom(item);
        }
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2xvbmVDb250YWluZWRJdGVtcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hY3Rpb24vaGVscGVycy9DbG9uZUNvbnRhaW5lZEl0ZW1zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7R0FTRzs7OztJQVFILDRCQU9DO0lBUEQsbUJBQXlCLE1BQWMsRUFBRSxJQUF5QixFQUFFLEVBQXVCO1FBQzFGLElBQUksQ0FBQyxDQUFDLGdCQUFnQixJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxnQkFBZ0IsSUFBSSxFQUFFLENBQUM7WUFBRSxPQUFPO1FBRXJFLEtBQUssTUFBTSxJQUFJLElBQUksSUFBSSxDQUFDLGNBQWMsSUFBSSxFQUFFLEVBQUUsQ0FBQztZQUM5QyxNQUFNLEtBQUssR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEVBQWdCLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQzdFLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNoQyxDQUFDO0lBQ0YsQ0FBQyJ9