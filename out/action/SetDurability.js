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
define(["require", "exports", "@wayward/game/game/entity/IEntity", "@wayward/game/game/entity/action/Action", "@wayward/game/game/entity/action/IAction", "../Actions", "../ui/InspectDialog"], function (require, exports, IEntity_1, Action_1, IAction_1, Actions_1, InspectDialog_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.setDurability = setDurability;
    exports.default = new Action_1.Action(IAction_1.ActionArgument.Item, IAction_1.ActionArgument.Float64)
        .setUsableBy(IEntity_1.EntityType.Human)
        .setUsableWhen(...Actions_1.defaultUsability)
        .setCanUse(Actions_1.defaultCanUseHandler)
        .setHandler((action, item, durability) => setDurability(action, durability, item));
    function setDurability(action, durability, ...items) {
        const canUse = action.canUse();
        if (!canUse.usable) {
            return;
        }
        let human;
        for (const item of items) {
            human ??= item.getCurrentOwner();
            item.durability = Number.isInteger(durability) || durability > 1 ? durability : Math.ceil((item.durabilityMax ?? 1) * durability);
        }
        if (human)
            human.updateTablesAndWeight("M");
        else
            action.setUpdateView();
        InspectDialog_1.default.INSTANCE?.update();
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2V0RHVyYWJpbGl0eS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hY3Rpb24vU2V0RHVyYWJpbGl0eS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7O0dBU0c7Ozs7SUFtQkgsc0NBa0JDO0lBeEJELGtCQUFlLElBQUksZUFBTSxDQUFDLHdCQUFjLENBQUMsSUFBSSxFQUFFLHdCQUFjLENBQUMsT0FBTyxDQUFDO1NBQ3BFLFdBQVcsQ0FBQyxvQkFBVSxDQUFDLEtBQUssQ0FBQztTQUM3QixhQUFhLENBQUMsR0FBRywwQkFBZ0IsQ0FBQztTQUNsQyxTQUFTLENBQUMsOEJBQW9CLENBQUM7U0FDL0IsVUFBVSxDQUFDLENBQUMsTUFBTSxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsRUFBRSxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUUsVUFBVSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7SUFFcEYsU0FBZ0IsYUFBYSxDQUFDLE1BQWdDLEVBQUUsVUFBa0IsRUFBRSxHQUFHLEtBQWE7UUFDbkcsTUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQy9CLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUM7WUFDcEIsT0FBTztRQUNSLENBQUM7UUFFRCxJQUFJLEtBQXdCLENBQUM7UUFDN0IsS0FBSyxNQUFNLElBQUksSUFBSSxLQUFLLEVBQUUsQ0FBQztZQUMxQixLQUFLLEtBQUssSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO1lBQ2pDLElBQUksQ0FBQyxVQUFVLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsSUFBSSxVQUFVLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsYUFBYSxJQUFJLENBQUMsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxDQUFDO1FBQ25JLENBQUM7UUFFRCxJQUFJLEtBQUs7WUFDUixLQUFLLENBQUMscUJBQXFCLENBQUMsR0FBRyxDQUFDLENBQUM7O1lBRWpDLE1BQU0sQ0FBQyxhQUFhLEVBQUUsQ0FBQztRQUV4Qix1QkFBYSxDQUFDLFFBQVEsRUFBRSxNQUFNLEVBQUUsQ0FBQztJQUNsQyxDQUFDIn0=