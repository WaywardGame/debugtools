define(["require", "exports", "game/entity/action/Action", "game/entity/action/IAction", "game/entity/IEntity", "../Actions", "./helpers/SetTilled"], function (require, exports, Action_1, IAction_1, IEntity_1, Actions_1, SetTilled_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = new Action_1.Action(IAction_1.ActionArgument.Integer32, IAction_1.ActionArgument.Vector3)
        .setUsableBy(IEntity_1.EntityType.Player)
        .setUsableWhen(...Actions_1.defaultUsability)
        .setHandler((action, terrain, position) => {
        if (!position)
            return;
        action.executor.island.changeTile(terrain, position.x, position.y, position.z, false);
        (0, SetTilled_1.default)(action.executor.island, position.x, position.y, position.z, false);
        renderer === null || renderer === void 0 ? void 0 : renderer.computeSpritesInViewport();
        action.setUpdateRender();
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2hhbmdlVGVycmFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hY3Rpb24vQ2hhbmdlVGVycmFpbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7SUFPQSxrQkFBZSxJQUFJLGVBQU0sQ0FBQyx3QkFBYyxDQUFDLFNBQVMsRUFBRSx3QkFBYyxDQUFDLE9BQU8sQ0FBQztTQUN6RSxXQUFXLENBQUMsb0JBQVUsQ0FBQyxNQUFNLENBQUM7U0FDOUIsYUFBYSxDQUFDLEdBQUcsMEJBQWdCLENBQUM7U0FDbEMsVUFBVSxDQUFDLENBQUMsTUFBTSxFQUFFLE9BQW9CLEVBQUUsUUFBUSxFQUFFLEVBQUU7UUFDdEQsSUFBSSxDQUFDLFFBQVE7WUFBRSxPQUFPO1FBRXRCLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDdEYsSUFBQSxtQkFBUyxFQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRTdFLFFBQVEsYUFBUixRQUFRLHVCQUFSLFFBQVEsQ0FBRSx3QkFBd0IsRUFBRSxDQUFDO1FBQ3JDLE1BQU0sQ0FBQyxlQUFlLEVBQUUsQ0FBQztJQUMxQixDQUFDLENBQUMsQ0FBQyJ9