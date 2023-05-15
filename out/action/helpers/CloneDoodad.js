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
define(["require", "exports", "game/magic/MagicalPropertyManager", "./CloneContainedItems"], function (require, exports, MagicalPropertyManager_1, CloneContainedItems_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
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
    exports.default = default_1;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2xvbmVEb29kYWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYWN0aW9uL2hlbHBlcnMvQ2xvbmVEb29kYWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7OztHQVNHOzs7O0lBVUgsbUJBQXlCLE1BQWMsRUFBRSxJQUFVO1FBQ2xELE1BQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRTtZQUM3RCxPQUFPLEVBQUUsTUFBTSxDQUFDLE9BQU87WUFDdkIsY0FBYyxFQUFFLE1BQU0sQ0FBQyxjQUFjO1lBQ3JDLFdBQVcsRUFBRSxNQUFNLENBQUMsV0FBVztZQUMvQixNQUFNLEVBQUUsTUFBTSxDQUFDLE1BQU07WUFDckIsTUFBTSxFQUFFLE1BQU0sQ0FBQyxNQUFNO1lBQ3JCLE1BQU0sRUFBRSxNQUFNLENBQUMsTUFBTTtZQUNyQixXQUFXLEVBQUUsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxXQUFXO2lCQUMvRCxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDdEUsaUJBQWlCLEVBQUUsTUFBTSxDQUFDLGlCQUFpQjtZQUMzQyxpQkFBaUIsRUFBRSxNQUFNLENBQUMsaUJBQWlCO1lBQzNDLElBQUksRUFBRSxNQUFNLENBQUMsSUFBSTtTQUNqQixDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsS0FBSztZQUFFLE9BQU87UUFFbkIsZ0NBQXNCLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQztRQUU5QyxJQUFJLE1BQU0sQ0FBQyxjQUFjLEVBQUU7WUFDMUIsSUFBQSw2QkFBbUIsRUFBQyxNQUFNLENBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQztTQUNsRDtJQUNGLENBQUM7SUF0QkQsNEJBc0JDIn0=