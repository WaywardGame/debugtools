define(["require", "exports", "game/doodad/Doodad", "game/entity/action/Action", "game/entity/action/IAction", "game/entity/IEntity", "../Actions", "../IDebugTools", "./helpers/CloneDoodad", "./helpers/CloneEntity", "./helpers/GetTile"], function (require, exports, Doodad_1, Action_1, IAction_1, IEntity_1, Actions_1, IDebugTools_1, CloneDoodad_1, CloneEntity_1, GetTile_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = new Action_1.Action((0, IAction_1.anyOf)(IAction_1.ActionArgument.Entity, IAction_1.ActionArgument.Doodad), IAction_1.ActionArgument.Tile)
        .setUsableBy(IEntity_1.EntityType.Human)
        .setUsableWhen(...Actions_1.defaultUsability)
        .setHandler((action, toClone, tile) => {
        const targetTile = (0, GetTile_1.getTile)(action.executor, tile, () => (0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.ActionClone)
            .get(toClone.getName()));
        if (!targetTile) {
            return;
        }
        if (toClone instanceof Doodad_1.default) {
            (0, CloneDoodad_1.default)(toClone, targetTile);
        }
        else {
            (0, CloneEntity_1.default)(toClone, targetTile);
        }
        renderers.computeSpritesInViewport(targetTile);
        action.setUpdateRender();
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2xvbmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvYWN0aW9uL0Nsb25lLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztJQWNBLGtCQUFlLElBQUksZUFBTSxDQUFDLElBQUEsZUFBSyxFQUFDLHdCQUFjLENBQUMsTUFBTSxFQUFFLHdCQUFjLENBQUMsTUFBTSxDQUFDLEVBQUUsd0JBQWMsQ0FBQyxJQUFJLENBQUM7U0FDakcsV0FBVyxDQUFDLG9CQUFVLENBQUMsS0FBSyxDQUFDO1NBQzdCLGFBQWEsQ0FBQyxHQUFHLDBCQUFnQixDQUFDO1NBQ2xDLFVBQVUsQ0FBQyxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsSUFBVSxFQUFFLEVBQUU7UUFDM0MsTUFBTSxVQUFVLEdBQUcsSUFBQSxpQkFBTyxFQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxDQUFDLElBQUEseUJBQVcsRUFBQyxtQ0FBcUIsQ0FBQyxXQUFXLENBQUM7YUFDcEcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDMUIsSUFBSSxDQUFDLFVBQVUsRUFBRTtZQUNoQixPQUFPO1NBQ1A7UUFFRCxJQUFJLE9BQU8sWUFBWSxnQkFBTSxFQUFFO1lBQzlCLElBQUEscUJBQVcsRUFBQyxPQUFPLEVBQUUsVUFBVSxDQUFDLENBQUM7U0FFakM7YUFBTTtZQUNOLElBQUEscUJBQVcsRUFBQyxPQUFPLEVBQUUsVUFBVSxDQUFDLENBQUM7U0FDakM7UUFFRCxTQUFTLENBQUMsd0JBQXdCLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDL0MsTUFBTSxDQUFDLGVBQWUsRUFBRSxDQUFDO0lBQzFCLENBQUMsQ0FBQyxDQUFDIn0=