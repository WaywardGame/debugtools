define(["require", "exports", "game/doodad/Doodad", "game/entity/action/Action", "game/entity/action/IAction", "game/entity/IEntity", "../Actions", "../IDebugTools", "./helpers/CloneDoodad", "./helpers/CloneEntity", "./helpers/GetPosition"], function (require, exports, Doodad_1, Action_1, IAction_1, IEntity_1, Actions_1, IDebugTools_1, CloneDoodad_1, CloneEntity_1, GetPosition_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = new Action_1.Action((0, IAction_1.anyOf)(IAction_1.ActionArgument.Entity, IAction_1.ActionArgument.Doodad), IAction_1.ActionArgument.Vector3)
        .setUsableBy(IEntity_1.EntityType.Player)
        .setUsableWhen(...Actions_1.defaultUsability)
        .setHandler((action, toClone, position) => {
        position = (0, GetPosition_1.default)(action.executor, position, () => (0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.ActionClone)
            .get(toClone.getName()));
        if (!position)
            return;
        if (toClone instanceof Doodad_1.default) {
            (0, CloneDoodad_1.default)(toClone, position);
        }
        else {
            (0, CloneEntity_1.default)(toClone, position);
        }
        renderer?.computeSpritesInViewport();
        action.setUpdateRender();
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2xvbmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvYWN0aW9uL0Nsb25lLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztJQWNBLGtCQUFlLElBQUksZUFBTSxDQUFDLElBQUEsZUFBSyxFQUFDLHdCQUFjLENBQUMsTUFBTSxFQUFFLHdCQUFjLENBQUMsTUFBTSxDQUFDLEVBQUUsd0JBQWMsQ0FBQyxPQUFPLENBQUM7U0FDcEcsV0FBVyxDQUFDLG9CQUFVLENBQUMsTUFBTSxDQUFDO1NBQzlCLGFBQWEsQ0FBQyxHQUFHLDBCQUFnQixDQUFDO1NBQ2xDLFVBQVUsQ0FBQyxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsUUFBOEIsRUFBRSxFQUFFO1FBRS9ELFFBQVEsR0FBRyxJQUFBLHFCQUFXLEVBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxRQUFTLEVBQUUsR0FBRyxFQUFFLENBQUMsSUFBQSx5QkFBVyxFQUFDLG1DQUFxQixDQUFDLFdBQVcsQ0FBQzthQUNyRyxHQUFHLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQztRQUUxQixJQUFJLENBQUMsUUFBUTtZQUFFLE9BQU87UUFFdEIsSUFBSSxPQUFPLFlBQVksZ0JBQU0sRUFBRTtZQUM5QixJQUFBLHFCQUFXLEVBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1NBRS9CO2FBQU07WUFDTixJQUFBLHFCQUFXLEVBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1NBQy9CO1FBRUQsUUFBUSxFQUFFLHdCQUF3QixFQUFFLENBQUM7UUFDckMsTUFBTSxDQUFDLGVBQWUsRUFBRSxDQUFDO0lBQzFCLENBQUMsQ0FBQyxDQUFDIn0=