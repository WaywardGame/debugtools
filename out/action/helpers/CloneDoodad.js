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
define(["require", "exports", "@wayward/game/game/magic/MagicalPropertyManager", "./CloneContainedItems"], function (require, exports, MagicalPropertyManager_1, CloneContainedItems_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
    function default_1(doodad, tile) {
        const clone = doodad.island.doodads.create(doodad.type, tile, {
            quality: doodad.quality,
            stillContainer: doodad.stillContainer,
            gatherReady: doodad.gatherReady,
            growth: doodad.growth,
            spread: doodad.spread,
            weight: doodad.weight,
            disassembly: !doodad.disassembly ? undefined : doodad.disassembly
                .map(item => doodad.island.items.createFake(item.type, item.quality)),
            builderIdentifier: doodad.builderIdentifier,
            crafterIdentifier: doodad.crafterIdentifier,
            step: doodad.step,
        });
        if (!clone)
            return;
        MagicalPropertyManager_1.default.inherit(doodad, clone);
        if (doodad.containedItems) {
            (0, CloneContainedItems_1.default)(doodad.island, doodad, clone);
        }
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2xvbmVEb29kYWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYWN0aW9uL2hlbHBlcnMvQ2xvbmVEb29kYWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7OztHQVNHOzs7O0lBVUgsNEJBc0JDO0lBdEJELG1CQUF5QixNQUFjLEVBQUUsSUFBVTtRQUNsRCxNQUFNLEtBQUssR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUU7WUFDN0QsT0FBTyxFQUFFLE1BQU0sQ0FBQyxPQUFPO1lBQ3ZCLGNBQWMsRUFBRSxNQUFNLENBQUMsY0FBYztZQUNyQyxXQUFXLEVBQUUsTUFBTSxDQUFDLFdBQVc7WUFDL0IsTUFBTSxFQUFFLE1BQU0sQ0FBQyxNQUFNO1lBQ3JCLE1BQU0sRUFBRSxNQUFNLENBQUMsTUFBTTtZQUNyQixNQUFNLEVBQUUsTUFBTSxDQUFDLE1BQU07WUFDckIsV0FBVyxFQUFFLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsV0FBVztpQkFDL0QsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ3RFLGlCQUFpQixFQUFFLE1BQU0sQ0FBQyxpQkFBaUI7WUFDM0MsaUJBQWlCLEVBQUUsTUFBTSxDQUFDLGlCQUFpQjtZQUMzQyxJQUFJLEVBQUUsTUFBTSxDQUFDLElBQUk7U0FDakIsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLEtBQUs7WUFBRSxPQUFPO1FBRW5CLGdDQUFzQixDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFOUMsSUFBSSxNQUFNLENBQUMsY0FBYyxFQUFFLENBQUM7WUFDM0IsSUFBQSw2QkFBbUIsRUFBQyxNQUFNLENBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQztRQUNuRCxDQUFDO0lBQ0YsQ0FBQyJ9