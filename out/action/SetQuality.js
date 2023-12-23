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
define(["require", "exports", "@wayward/game/game/IObject", "@wayward/game/game/entity/IEntity", "@wayward/game/game/entity/action/Action", "@wayward/game/game/entity/action/IAction", "../Actions", "../ui/InspectDialog"], function (require, exports, IObject_1, IEntity_1, Action_1, IAction_1, Actions_1, InspectDialog_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.setQuality = void 0;
    exports.default = new Action_1.Action(IAction_1.ActionArgument.Item, IAction_1.ActionArgument.ENUM(IObject_1.Quality))
        .setUsableBy(IEntity_1.EntityType.Human)
        .setUsableWhen(...Actions_1.defaultUsability)
        .setCanUse(Actions_1.defaultCanUseHandler)
        .setHandler((action, item, quality) => setQuality(action, quality, item));
    function setQuality(action, quality, ...items) {
        const canUse = action.canUse();
        if (!canUse.usable) {
            return;
        }
        let human;
        for (const item of items) {
            human ??= item.getCurrentOwner();
            item.setQuality(human, quality);
        }
        if (human)
            human.updateTablesAndWeight("M");
        else
            action.setUpdateView();
        InspectDialog_1.default.INSTANCE?.update();
    }
    exports.setQuality = setQuality;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2V0UXVhbGl0eS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hY3Rpb24vU2V0UXVhbGl0eS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7O0dBU0c7Ozs7O0lBY0gsa0JBQWUsSUFBSSxlQUFNLENBQUMsd0JBQWMsQ0FBQyxJQUFJLEVBQUUsd0JBQWMsQ0FBQyxJQUFJLENBQUMsaUJBQU8sQ0FBQyxDQUFDO1NBQzFFLFdBQVcsQ0FBQyxvQkFBVSxDQUFDLEtBQUssQ0FBQztTQUM3QixhQUFhLENBQUMsR0FBRywwQkFBZ0IsQ0FBQztTQUNsQyxTQUFTLENBQUMsOEJBQW9CLENBQUM7U0FDL0IsVUFBVSxDQUFDLENBQUMsTUFBTSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsRUFBRSxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7SUFFM0UsU0FBZ0IsVUFBVSxDQUFDLE1BQWdDLEVBQUUsT0FBZ0IsRUFBRSxHQUFHLEtBQWE7UUFDOUYsTUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQy9CLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUM7WUFDcEIsT0FBTztRQUNSLENBQUM7UUFFRCxJQUFJLEtBQXdCLENBQUM7UUFDN0IsS0FBSyxNQUFNLElBQUksSUFBSSxLQUFLLEVBQUUsQ0FBQztZQUMxQixLQUFLLEtBQUssSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO1lBQ2pDLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ2pDLENBQUM7UUFFRCxJQUFJLEtBQUs7WUFDUixLQUFLLENBQUMscUJBQXFCLENBQUMsR0FBRyxDQUFDLENBQUM7O1lBRWpDLE1BQU0sQ0FBQyxhQUFhLEVBQUUsQ0FBQztRQUV4Qix1QkFBYSxDQUFDLFFBQVEsRUFBRSxNQUFNLEVBQUUsQ0FBQztJQUNsQyxDQUFDO0lBbEJELGdDQWtCQyJ9