define(["require", "exports", "action/Action", "action/IAction", "doodad/doodads/Doodad", "entity/IEntity", "../Actions", "../IDebugTools", "./helpers/CloneDoodad", "./helpers/CloneEntity", "./helpers/GetPosition"], function (require, exports, Action_1, IAction_1, Doodad_1, IEntity_1, Actions_1, IDebugTools_1, CloneDoodad_1, CloneEntity_1, GetPosition_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = new Action_1.Action(IAction_1.anyOf(IAction_1.ActionArgument.Entity, IAction_1.ActionArgument.Doodad), IAction_1.ActionArgument.Vector3)
        .setUsableBy(IEntity_1.EntityType.Player)
        .setUsableWhen(...Actions_1.defaultUsability)
        .setHandler((action, toClone, position) => {
        position = GetPosition_1.default(action.executor, position, () => IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ActionClone)
            .get(toClone.getName()));
        if (!position)
            return;
        if (toClone instanceof Doodad_1.default) {
            CloneDoodad_1.default(toClone, position);
        }
        else {
            CloneEntity_1.default(toClone, position);
        }
        renderer.computeSpritesInViewport();
        action.setUpdateRender();
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2xvbmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvYWN0aW9uL0Nsb25lLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztJQWNBLGtCQUFlLElBQUksZUFBTSxDQUFDLGVBQUssQ0FBQyx3QkFBYyxDQUFDLE1BQU0sRUFBRSx3QkFBYyxDQUFDLE1BQU0sQ0FBQyxFQUFFLHdCQUFjLENBQUMsT0FBTyxDQUFDO1NBQ3BHLFdBQVcsQ0FBQyxvQkFBVSxDQUFDLE1BQU0sQ0FBQztTQUM5QixhQUFhLENBQUMsR0FBRywwQkFBZ0IsQ0FBQztTQUNsQyxVQUFVLENBQUMsQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLFFBQThCLEVBQUUsRUFBRTtRQUUvRCxRQUFRLEdBQUcscUJBQVcsQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLFFBQVMsRUFBRSxHQUFHLEVBQUUsQ0FBQyx5QkFBVyxDQUFDLG1DQUFxQixDQUFDLFdBQVcsQ0FBQzthQUNyRyxHQUFHLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQztRQUUxQixJQUFJLENBQUMsUUFBUTtZQUFFLE9BQU87UUFFdEIsSUFBSSxPQUFPLFlBQVksZ0JBQU0sRUFBRTtZQUM5QixxQkFBVyxDQUFDLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQztTQUUvQjthQUFNO1lBQ04scUJBQVcsQ0FBQyxPQUFrQyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1NBQzFEO1FBRUQsUUFBUSxDQUFDLHdCQUF3QixFQUFFLENBQUM7UUFDcEMsTUFBTSxDQUFDLGVBQWUsRUFBRSxDQUFDO0lBQzFCLENBQUMsQ0FBQyxDQUFDIn0=