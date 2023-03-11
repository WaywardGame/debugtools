define(["require", "exports", "game/entity/action/Action", "game/entity/action/IAction", "game/entity/IEntity", "../Actions", "./helpers/SetTilled"], function (require, exports, Action_1, IAction_1, IEntity_1, Actions_1, SetTilled_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = new Action_1.Action(IAction_1.ActionArgument.Integer32, IAction_1.ActionArgument.Tile)
        .setUsableBy(IEntity_1.EntityType.Player)
        .setUsableWhen(...Actions_1.defaultUsability)
        .setHandler((action, terrain, tile) => {
        tile.changeTile(terrain, false);
        (0, SetTilled_1.default)(action.executor.island, tile, false);
        renderers.computeSpritesInViewport(tile);
        action.setUpdateRender();
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2hhbmdlVGVycmFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hY3Rpb24vQ2hhbmdlVGVycmFpbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7SUFPQSxrQkFBZSxJQUFJLGVBQU0sQ0FBQyx3QkFBYyxDQUFDLFNBQVMsRUFBRSx3QkFBYyxDQUFDLElBQUksQ0FBQztTQUN0RSxXQUFXLENBQUMsb0JBQVUsQ0FBQyxNQUFNLENBQUM7U0FDOUIsYUFBYSxDQUFDLEdBQUcsMEJBQWdCLENBQUM7U0FDbEMsVUFBVSxDQUFDLENBQUMsTUFBTSxFQUFFLE9BQW9CLEVBQUUsSUFBSSxFQUFFLEVBQUU7UUFDbEQsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDaEMsSUFBQSxtQkFBUyxFQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztRQUUvQyxTQUFTLENBQUMsd0JBQXdCLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDekMsTUFBTSxDQUFDLGVBQWUsRUFBRSxDQUFDO0lBQzFCLENBQUMsQ0FBQyxDQUFDIn0=