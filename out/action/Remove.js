define(["require", "exports", "game/entity/action/Action", "game/entity/action/IAction", "game/entity/IEntity", "game/entity/player/Player", "../Actions", "./helpers/Remove"], function (require, exports, Action_1, IAction_1, IEntity_1, Player_1, Actions_1, Remove_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = new Action_1.Action((0, IAction_1.anyOf)(IAction_1.ActionArgument.Entity, IAction_1.ActionArgument.Doodad, IAction_1.ActionArgument.Corpse, IAction_1.ActionArgument.TileEvent, IAction_1.ActionArgument.Item))
        .setUsableBy(IEntity_1.EntityType.Player)
        .setUsableWhen(...Actions_1.defaultUsability)
        .setHandler((action, toRemove) => {
        if (toRemove instanceof Player_1.default) {
            return;
        }
        (0, Remove_1.default)(action, toRemove);
        renderers.computeSpritesInViewport(toRemove);
        action.setUpdateRender();
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVtb3ZlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2FjdGlvbi9SZW1vdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0lBVUEsa0JBQWUsSUFBSSxlQUFNLENBQUMsSUFBQSxlQUFLLEVBQUMsd0JBQWMsQ0FBQyxNQUFNLEVBQUUsd0JBQWMsQ0FBQyxNQUFNLEVBQUUsd0JBQWMsQ0FBQyxNQUFNLEVBQUUsd0JBQWMsQ0FBQyxTQUFTLEVBQUUsd0JBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUNsSixXQUFXLENBQUMsb0JBQVUsQ0FBQyxNQUFNLENBQUM7U0FDOUIsYUFBYSxDQUFDLEdBQUcsMEJBQWdCLENBQUM7U0FDbEMsVUFBVSxDQUFDLENBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRSxFQUFFO1FBQ2hDLElBQUksUUFBUSxZQUFZLGdCQUFNLEVBQUU7WUFDL0IsT0FBTztTQUNQO1FBRUQsSUFBQSxnQkFBTSxFQUFDLE1BQU0sRUFBRSxRQUFlLENBQUMsQ0FBQztRQUVoQyxTQUFTLENBQUMsd0JBQXdCLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDN0MsTUFBTSxDQUFDLGVBQWUsRUFBRSxDQUFDO0lBQzFCLENBQUMsQ0FBQyxDQUFDIn0=