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
    function default_1(island, from, to) {
        if (!("containedItems" in from) || !("containedItems" in to))
            return;
        for (const item of from.containedItems || []) {
            const clone = island.items.create(item.type, to, item.quality);
            clone.crafterIdentifier = item.crafterIdentifier;
            renderers.notifier.suspend();
            clone.durability = item.durability;
            renderers.notifier.resume();
            clone.durabilityMax = item.durabilityMax;
            clone.renamed = item.renamed;
            clone.weight = item.weight;
            MagicalPropertyManager_1.default.inherit(item, clone);
        }
    }
    exports.default = default_1;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2xvbmVDb250YWluZWRJdGVtcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hY3Rpb24vaGVscGVycy9DbG9uZUNvbnRhaW5lZEl0ZW1zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7R0FTRzs7OztJQVNILG1CQUF5QixNQUFjLEVBQUUsSUFBeUIsRUFBRSxFQUF1QjtRQUMxRixJQUFJLENBQUMsQ0FBQyxnQkFBZ0IsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsZ0JBQWdCLElBQUksRUFBRSxDQUFDO1lBQUUsT0FBTztRQUVyRSxLQUFLLE1BQU0sSUFBSSxJQUFJLElBQUksQ0FBQyxjQUFjLElBQUksRUFBRSxFQUFFO1lBQzdDLE1BQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsRUFBZ0IsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDN0UsS0FBSyxDQUFDLGlCQUFpQixHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQztZQUNqRCxTQUFTLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQzdCLEtBQUssQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQztZQUNuQyxTQUFTLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQzVCLEtBQUssQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQztZQUN6QyxLQUFLLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7WUFDN0IsS0FBSyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO1lBQzNCLGdDQUFzQixDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7U0FDNUM7SUFDRixDQUFDO0lBZEQsNEJBY0MifQ==