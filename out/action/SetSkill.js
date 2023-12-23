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
define(["require", "exports", "@wayward/game/game/entity/action/Action", "@wayward/game/game/entity/action/IAction", "@wayward/game/game/entity/IEntity", "@wayward/game/game/entity/IHuman", "@wayward/game/utilities/enum/Enums", "../Actions"], function (require, exports, Action_1, IAction_1, IEntity_1, IHuman_1, Enums_1, Actions_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = new Action_1.Action(IAction_1.ActionArgument.Player, IAction_1.ActionArgument.Integer32, IAction_1.ActionArgument.Float64)
        .setUsableBy(IEntity_1.EntityType.Human)
        .setUsableWhen(...Actions_1.defaultUsability)
        .setCanUse(Actions_1.defaultCanUseHandler)
        .setHandler((action, player, skill, value) => {
        if (!player)
            return;
        if (skill !== -1)
            player.skill.setCore(skill, value);
        else
            for (const skill of Enums_1.default.values(IHuman_1.SkillType))
                if (skill)
                    player.skill.setCore(skill, value);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2V0U2tpbGwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvYWN0aW9uL1NldFNraWxsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7R0FTRzs7OztJQVNILGtCQUFlLElBQUksZUFBTSxDQUFDLHdCQUFjLENBQUMsTUFBTSxFQUFFLHdCQUFjLENBQUMsU0FBUyxFQUFFLHdCQUFjLENBQUMsT0FBTyxDQUFDO1NBQ2hHLFdBQVcsQ0FBQyxvQkFBVSxDQUFDLEtBQUssQ0FBQztTQUM3QixhQUFhLENBQUMsR0FBRywwQkFBZ0IsQ0FBQztTQUNsQyxTQUFTLENBQUMsOEJBQW9CLENBQUM7U0FDL0IsVUFBVSxDQUFDLENBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRSxLQUFnQixFQUFFLEtBQUssRUFBRSxFQUFFO1FBQ3ZELElBQUksQ0FBQyxNQUFNO1lBQUUsT0FBTztRQUVwQixJQUFJLEtBQWUsS0FBSyxDQUFDLENBQUM7WUFDekIsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDOztZQUduQyxLQUFLLE1BQU0sS0FBSyxJQUFJLGVBQUssQ0FBQyxNQUFNLENBQUMsa0JBQVMsQ0FBQztnQkFDMUMsSUFBSSxLQUFLO29CQUNSLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztJQUN2QyxDQUFDLENBQUMsQ0FBQyJ9