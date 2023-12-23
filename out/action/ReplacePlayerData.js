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
define(["require", "exports", "@wayward/game/game/entity/IEntity", "@wayward/game/game/entity/IHuman", "@wayward/game/game/entity/action/Action", "@wayward/game/game/entity/action/IAction", "@wayward/game/utilities/enum/Enums", "../Actions", "./helpers/CloneInventory"], function (require, exports, IEntity_1, IHuman_1, Action_1, IAction_1, Enums_1, Actions_1, CloneInventory_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = new Action_1.Action(IAction_1.ActionArgument.Player, IAction_1.ActionArgument.Player)
        .setUsableBy(IEntity_1.EntityType.Player)
        .setUsableWhen(...Actions_1.defaultUsability)
        .setCanUse(Actions_1.defaultCanUseHandler)
        .setConfirmer((action, target, from) => {
        return action.prompt(Actions_1.default.DEBUG_TOOLS.prompts.promptReplacePlayerData, target.getName(), from.getName());
    })
        .setHandler((action, target, from) => {
        for (const skill of Enums_1.default.values(IHuman_1.SkillType)) {
            target.skill.set(skill, from.skill.getCore(skill));
        }
        (0, CloneInventory_1.default)(from, target);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVwbGFjZVBsYXllckRhdGEuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvYWN0aW9uL1JlcGxhY2VQbGF5ZXJEYXRhLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7R0FTRzs7OztJQVVILGtCQUFlLElBQUksZUFBTSxDQUFDLHdCQUFjLENBQUMsTUFBTSxFQUFFLHdCQUFjLENBQUMsTUFBTSxDQUFDO1NBQ3JFLFdBQVcsQ0FBQyxvQkFBVSxDQUFDLE1BQU0sQ0FBQztTQUM5QixhQUFhLENBQUMsR0FBRywwQkFBZ0IsQ0FBQztTQUNsQyxTQUFTLENBQUMsOEJBQW9CLENBQUM7U0FDL0IsWUFBWSxDQUFDLENBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsRUFBRTtRQUN0QyxPQUFPLE1BQU0sQ0FBQyxNQUFNLENBQUMsaUJBQU8sQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLHVCQUF1QixFQUN2RSxNQUFNLENBQUMsT0FBTyxFQUFFLEVBQ2hCLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO0lBQ2xCLENBQUMsQ0FBQztTQUNELFVBQVUsQ0FBQyxDQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLEVBQUU7UUFDcEMsS0FBSyxNQUFNLEtBQUssSUFBSSxlQUFLLENBQUMsTUFBTSxDQUFDLGtCQUFTLENBQUMsRUFBRSxDQUFDO1lBQzdDLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQ3BELENBQUM7UUFFRCxJQUFBLHdCQUFjLEVBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBRzlCLENBQUMsQ0FBQyxDQUFDIn0=