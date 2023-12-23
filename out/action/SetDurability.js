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
    exports.setDurability = void 0;
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
    exports.setDurability = setDurability;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2V0RHVyYWJpbGl0eS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hY3Rpb24vU2V0RHVyYWJpbGl0eS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7O0dBU0c7Ozs7O0lBYUgsa0JBQWUsSUFBSSxlQUFNLENBQUMsd0JBQWMsQ0FBQyxJQUFJLEVBQUUsd0JBQWMsQ0FBQyxPQUFPLENBQUM7U0FDcEUsV0FBVyxDQUFDLG9CQUFVLENBQUMsS0FBSyxDQUFDO1NBQzdCLGFBQWEsQ0FBQyxHQUFHLDBCQUFnQixDQUFDO1NBQ2xDLFNBQVMsQ0FBQyw4QkFBb0IsQ0FBQztTQUMvQixVQUFVLENBQUMsQ0FBQyxNQUFNLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxFQUFFLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRSxVQUFVLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUVwRixTQUFnQixhQUFhLENBQUMsTUFBZ0MsRUFBRSxVQUFrQixFQUFFLEdBQUcsS0FBYTtRQUNuRyxNQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDL0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUNwQixPQUFPO1FBQ1IsQ0FBQztRQUVELElBQUksS0FBd0IsQ0FBQztRQUM3QixLQUFLLE1BQU0sSUFBSSxJQUFJLEtBQUssRUFBRSxDQUFDO1lBQzFCLEtBQUssS0FBSyxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7WUFDakMsSUFBSSxDQUFDLFVBQVUsR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxJQUFJLFVBQVUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxhQUFhLElBQUksQ0FBQyxDQUFDLEdBQUcsVUFBVSxDQUFDLENBQUM7UUFDbkksQ0FBQztRQUVELElBQUksS0FBSztZQUNSLEtBQUssQ0FBQyxxQkFBcUIsQ0FBQyxHQUFHLENBQUMsQ0FBQzs7WUFFakMsTUFBTSxDQUFDLGFBQWEsRUFBRSxDQUFDO1FBRXhCLHVCQUFhLENBQUMsUUFBUSxFQUFFLE1BQU0sRUFBRSxDQUFDO0lBQ2xDLENBQUM7SUFsQkQsc0NBa0JDIn0=