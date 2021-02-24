define(["require", "exports", "entity/action/Action", "entity/action/IAction", "entity/IEntity", "entity/player/Player", "../Actions", "./helpers/Remove"], function (require, exports, Action_1, IAction_1, IEntity_1, Player_1, Actions_1, Remove_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = new Action_1.Action(IAction_1.anyOf(IAction_1.ActionArgument.Entity, IAction_1.ActionArgument.Doodad, IAction_1.ActionArgument.Corpse, IAction_1.ActionArgument.TileEvent, IAction_1.ActionArgument.Item))
        .setUsableBy(IEntity_1.EntityType.Player)
        .setUsableWhen(...Actions_1.defaultUsability)
        .setHandler((action, toRemove) => {
        if (toRemove instanceof Player_1.default) {
            return;
        }
        Remove_1.default(action, toRemove);
        renderer === null || renderer === void 0 ? void 0 : renderer.computeSpritesInViewport();
        action.setUpdateRender();
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVtb3ZlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2FjdGlvbi9SZW1vdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0lBVUEsa0JBQWUsSUFBSSxlQUFNLENBQUMsZUFBSyxDQUFDLHdCQUFjLENBQUMsTUFBTSxFQUFFLHdCQUFjLENBQUMsTUFBTSxFQUFFLHdCQUFjLENBQUMsTUFBTSxFQUFFLHdCQUFjLENBQUMsU0FBUyxFQUFFLHdCQUFjLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDbEosV0FBVyxDQUFDLG9CQUFVLENBQUMsTUFBTSxDQUFDO1NBQzlCLGFBQWEsQ0FBQyxHQUFHLDBCQUFnQixDQUFDO1NBQ2xDLFVBQVUsQ0FBQyxDQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUUsRUFBRTtRQUNoQyxJQUFJLFFBQVEsWUFBWSxnQkFBTSxFQUFFO1lBQy9CLE9BQU87U0FDUDtRQUVELGdCQUFNLENBQUMsTUFBTSxFQUFFLFFBQWUsQ0FBQyxDQUFDO1FBRWhDLFFBQVEsYUFBUixRQUFRLHVCQUFSLFFBQVEsQ0FBRSx3QkFBd0IsRUFBRSxDQUFDO1FBQ3JDLE1BQU0sQ0FBQyxlQUFlLEVBQUUsQ0FBQztJQUMxQixDQUFDLENBQUMsQ0FBQyJ9