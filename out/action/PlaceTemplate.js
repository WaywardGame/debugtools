define(["require", "exports", "game/entity/action/Action", "game/entity/action/IAction", "game/entity/IEntity", "game/mapgen/MapGenHelpers", "../Actions"], function (require, exports, Action_1, IAction_1, IEntity_1, MapGenHelpers_1, Actions_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = new Action_1.Action(IAction_1.ActionArgument.Integer32, IAction_1.ActionArgument.Vector2, IAction_1.ActionArgument.Object)
        .setUsableBy(IEntity_1.EntityType.Player)
        .setUsableWhen(...Actions_1.defaultUsability)
        .setHandler((action, type, point, options) => {
        (0, MapGenHelpers_1.spawnTemplate)(action.executor.island, type, point.x, point.y, action.executor.z, options);
        action.setUpdateView();
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGxhY2VUZW1wbGF0ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hY3Rpb24vUGxhY2VUZW1wbGF0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7SUFPQSxrQkFBZSxJQUFJLGVBQU0sQ0FBQyx3QkFBYyxDQUFDLFNBQVMsRUFBRSx3QkFBYyxDQUFDLE9BQU8sRUFBRSx3QkFBYyxDQUFDLE1BQU0sQ0FBQztTQUNoRyxXQUFXLENBQUMsb0JBQVUsQ0FBQyxNQUFNLENBQUM7U0FDOUIsYUFBYSxDQUFDLEdBQUcsMEJBQWdCLENBQUM7U0FDbEMsVUFBVSxDQUFDLENBQUMsTUFBTSxFQUFFLElBQXNCLEVBQUUsS0FBSyxFQUFFLE9BQXlCLEVBQUUsRUFBRTtRQUNoRixJQUFBLDZCQUFhLEVBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsSUFBSSxFQUFFLEtBQU0sQ0FBQyxDQUFDLEVBQUUsS0FBTSxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUM1RixNQUFNLENBQUMsYUFBYSxFQUFFLENBQUM7SUFDeEIsQ0FBQyxDQUFDLENBQUMifQ==