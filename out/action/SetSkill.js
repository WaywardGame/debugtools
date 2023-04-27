define(["require", "exports", "game/entity/action/Action", "game/entity/action/IAction", "game/entity/IEntity", "game/entity/IHuman", "utilities/enum/Enums", "../Actions"], function (require, exports, Action_1, IAction_1, IEntity_1, IHuman_1, Enums_1, Actions_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = new Action_1.Action(IAction_1.ActionArgument.Player, IAction_1.ActionArgument.Integer32, IAction_1.ActionArgument.Float64)
        .setUsableBy(IEntity_1.EntityType.Human)
        .setUsableWhen(...Actions_1.defaultUsability)
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2V0U2tpbGwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvYWN0aW9uL1NldFNraWxsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztJQU9BLGtCQUFlLElBQUksZUFBTSxDQUFDLHdCQUFjLENBQUMsTUFBTSxFQUFFLHdCQUFjLENBQUMsU0FBUyxFQUFFLHdCQUFjLENBQUMsT0FBTyxDQUFDO1NBQ2hHLFdBQVcsQ0FBQyxvQkFBVSxDQUFDLEtBQUssQ0FBQztTQUM3QixhQUFhLENBQUMsR0FBRywwQkFBZ0IsQ0FBQztTQUNsQyxVQUFVLENBQUMsQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLEtBQWdCLEVBQUUsS0FBSyxFQUFFLEVBQUU7UUFDdkQsSUFBSSxDQUFDLE1BQU07WUFBRSxPQUFPO1FBRXBCLElBQUksS0FBZSxLQUFLLENBQUMsQ0FBQztZQUN6QixNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7O1lBR25DLEtBQUssTUFBTSxLQUFLLElBQUksZUFBSyxDQUFDLE1BQU0sQ0FBQyxrQkFBUyxDQUFDO2dCQUMxQyxJQUFJLEtBQUs7b0JBQ1IsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQ3ZDLENBQUMsQ0FBQyxDQUFDIn0=