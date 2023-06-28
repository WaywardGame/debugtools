define(["require", "exports", "game/entity/IEntity", "game/entity/IHuman", "game/entity/action/Action", "game/entity/action/IAction", "utilities/enum/Enums", "../Actions", "./helpers/CloneInventory"], function (require, exports, IEntity_1, IHuman_1, Action_1, IAction_1, Enums_1, Actions_1, CloneInventory_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = new Action_1.Action(IAction_1.ActionArgument.Player, IAction_1.ActionArgument.Player)
        .setUsableBy(IEntity_1.EntityType.Player)
        .setUsableWhen(...Actions_1.defaultUsability)
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVwbGFjZVBsYXllckRhdGEuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvYWN0aW9uL1JlcGxhY2VQbGF5ZXJEYXRhLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztJQVFBLGtCQUFlLElBQUksZUFBTSxDQUFDLHdCQUFjLENBQUMsTUFBTSxFQUFFLHdCQUFjLENBQUMsTUFBTSxDQUFDO1NBQ3JFLFdBQVcsQ0FBQyxvQkFBVSxDQUFDLE1BQU0sQ0FBQztTQUM5QixhQUFhLENBQUMsR0FBRywwQkFBZ0IsQ0FBQztTQUNsQyxZQUFZLENBQUMsQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxFQUFFO1FBQ3RDLE9BQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQyxpQkFBTyxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsdUJBQXVCLEVBQ3ZFLE1BQU0sQ0FBQyxPQUFPLEVBQUUsRUFDaEIsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUM7SUFDbEIsQ0FBQyxDQUFDO1NBQ0QsVUFBVSxDQUFDLENBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsRUFBRTtRQUNwQyxLQUFLLE1BQU0sS0FBSyxJQUFJLGVBQUssQ0FBQyxNQUFNLENBQUMsa0JBQVMsQ0FBQyxFQUFFO1lBQzVDLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1NBQ25EO1FBRUQsSUFBQSx3QkFBYyxFQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztJQUc5QixDQUFDLENBQUMsQ0FBQyJ9