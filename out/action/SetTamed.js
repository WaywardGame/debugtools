define(["require", "exports", "action/Action", "action/IAction", "entity/IEntity", "../Actions"], function (require, exports, Action_1, IAction_1, IEntity_1, Actions_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = new Action_1.Action(IAction_1.ActionArgument.Creature, IAction_1.ActionArgument.Boolean)
        .setUsableBy(IEntity_1.EntityType.Player)
        .setUsableWhen(...Actions_1.defaultUsability)
        .setHandler((action, creature, tamed) => {
        if (tamed)
            creature.tame(action.executor);
        else
            creature.release();
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2V0VGFtZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvYWN0aW9uL1NldFRhbWVkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztJQUtBLGtCQUFlLElBQUksZUFBTSxDQUFDLHdCQUFjLENBQUMsUUFBUSxFQUFFLHdCQUFjLENBQUMsT0FBTyxDQUFDO1NBQ3hFLFdBQVcsQ0FBQyxvQkFBVSxDQUFDLE1BQU0sQ0FBQztTQUM5QixhQUFhLENBQUMsR0FBRywwQkFBZ0IsQ0FBQztTQUNsQyxVQUFVLENBQUMsQ0FBQyxNQUFNLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxFQUFFO1FBQ3ZDLElBQUksS0FBSztZQUFFLFFBQVMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDOztZQUN0QyxRQUFTLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDMUIsQ0FBQyxDQUFDLENBQUMifQ==