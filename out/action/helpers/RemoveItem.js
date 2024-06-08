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
define(["require", "exports", "../../ui/InspectDialog"], function (require, exports, InspectDialog_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
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
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVtb3ZlSXRlbS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hY3Rpb24vaGVscGVycy9SZW1vdmVJdGVtLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7R0FTRzs7OztJQVFILDRCQWVDO0lBZkQsbUJBQXlCLE1BQXlCLEVBQUUsSUFBVTtRQUM3RCxNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDO1FBQ3ZDLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFMUMsSUFBSSxTQUFTLEVBQUUsQ0FBQztZQUNmLElBQUksTUFBTSxJQUFJLFNBQVMsRUFBRSxDQUFDO2dCQUN6QixNQUFNLENBQUMsYUFBYSxFQUFFLENBQUM7WUFFeEIsQ0FBQztpQkFBTSxJQUFJLFlBQVksSUFBSSxTQUFTLEVBQUUsQ0FBQztnQkFDdEMsTUFBTSxNQUFNLEdBQUcsU0FBMEIsQ0FBQztnQkFDMUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxxQkFBcUIsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUM3QyxDQUFDO1FBQ0YsQ0FBQztRQUVELHVCQUFhLENBQUMsUUFBUSxFQUFFLE1BQU0sRUFBRSxDQUFDO0lBQ2xDLENBQUMifQ==