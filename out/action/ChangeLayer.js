define(["require", "exports", "entity/action/Action", "entity/action/IAction", "entity/IEntity", "game/WorldZ", "utilities/enum/Enums", "../Actions"], function (require, exports, Action_1, IAction_1, IEntity_1, WorldZ_1, Enums_1, Actions_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = new Action_1.Action(IAction_1.ActionArgument.Number)
        .setUsableBy(IEntity_1.EntityType.Player)
        .setUsableWhen(...Actions_1.defaultUsability)
        .setHandler((action, z) => {
        if (!Enums_1.default.isValid(WorldZ_1.WorldZ, z))
            return;
        action.executor.setZ(z);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2hhbmdlTGF5ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvYWN0aW9uL0NoYW5nZUxheWVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztJQU9BLGtCQUFlLElBQUksZUFBTSxDQUFDLHdCQUFjLENBQUMsTUFBTSxDQUFDO1NBQzlDLFdBQVcsQ0FBQyxvQkFBVSxDQUFDLE1BQU0sQ0FBQztTQUM5QixhQUFhLENBQUMsR0FBRywwQkFBZ0IsQ0FBQztTQUNsQyxVQUFVLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDekIsSUFBSSxDQUFDLGVBQUssQ0FBQyxPQUFPLENBQUMsZUFBTSxFQUFFLENBQUMsQ0FBQztZQUM1QixPQUFPO1FBRVIsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDekIsQ0FBQyxDQUFDLENBQUMifQ==