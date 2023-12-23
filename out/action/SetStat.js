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
define(["require", "exports", "@wayward/game/game/entity/action/Action", "@wayward/game/game/entity/action/IAction", "@wayward/game/game/entity/IEntity", "@wayward/game/game/entity/IStats", "@wayward/game/ui/screen/IScreen", "../Actions"], function (require, exports, Action_1, IAction_1, IEntity_1, IStats_1, IScreen_1, Actions_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = new Action_1.Action(IAction_1.ActionArgument.Entity, IAction_1.ActionArgument.Integer32, IAction_1.ActionArgument.Float64)
        .setUsableBy(IEntity_1.EntityType.Human)
        .setUsableWhen(...Actions_1.defaultUsability)
        .setCanUse(Actions_1.defaultCanUseHandler)
        .setHandler((action, entity, stat, value) => {
        entity?.asEntityWithStats?.stat.set(stat, value);
        if (entity.asLocalPlayer && stat === IStats_1.Stat.Health) {
            ui.screens.get(IScreen_1.ScreenId.Game)?.["refreshHealthBasedEffects"]();
        }
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2V0U3RhdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hY3Rpb24vU2V0U3RhdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7O0dBU0c7Ozs7SUFTSCxrQkFBZSxJQUFJLGVBQU0sQ0FBQyx3QkFBYyxDQUFDLE1BQU0sRUFBRSx3QkFBYyxDQUFDLFNBQVMsRUFBRSx3QkFBYyxDQUFDLE9BQU8sQ0FBQztTQUNoRyxXQUFXLENBQUMsb0JBQVUsQ0FBQyxLQUFLLENBQUM7U0FDN0IsYUFBYSxDQUFDLEdBQUcsMEJBQWdCLENBQUM7U0FDbEMsU0FBUyxDQUFDLDhCQUFvQixDQUFDO1NBQy9CLFVBQVUsQ0FBQyxDQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUUsSUFBVSxFQUFFLEtBQUssRUFBRSxFQUFFO1FBQ2pELE1BQU0sRUFBRSxpQkFBaUIsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztRQUNqRCxJQUFJLE1BQU0sQ0FBQyxhQUFhLElBQUksSUFBSSxLQUFLLGFBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUNsRCxFQUFFLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxrQkFBUSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsMkJBQTJCLENBQUMsRUFBRSxDQUFDO1FBQ2hFLENBQUM7SUFDRixDQUFDLENBQUMsQ0FBQyJ9