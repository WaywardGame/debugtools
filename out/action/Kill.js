define(["require", "exports", "action/Action", "action/IAction", "entity/IEntity", "Enums", "../Actions", "../IDebugTools"], function (require, exports, Action_1, IAction_1, IEntity_1, Enums_1, Actions_1, IDebugTools_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = new Action_1.Action(IAction_1.ActionArgument.Entity)
        .setUsableBy(IEntity_1.EntityType.Player)
        .setUsableWhen(...Actions_1.defaultUsability)
        .setHandler((action, entity) => {
        entity.damage({
            type: Enums_1.DamageType.True,
            amount: Infinity,
            damageMessage: IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.KillEntityDeathMessage),
        });
        renderer.computeSpritesInViewport();
        action.setUpdateRender();
        if (!multiplayer.isConnected() && entity === localPlayer) {
            action.setPassTurn();
        }
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiS2lsbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hY3Rpb24vS2lsbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7SUFVQSxrQkFBZSxJQUFJLGVBQU0sQ0FBQyx3QkFBYyxDQUFDLE1BQU0sQ0FBQztTQUM5QyxXQUFXLENBQUMsb0JBQVUsQ0FBQyxNQUFNLENBQUM7U0FDOUIsYUFBYSxDQUFDLEdBQUcsMEJBQWdCLENBQUM7U0FDbEMsVUFBVSxDQUFDLENBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRSxFQUFFO1FBQzlCLE1BQU0sQ0FBQyxNQUFNLENBQUM7WUFDYixJQUFJLEVBQUUsa0JBQVUsQ0FBQyxJQUFJO1lBQ3JCLE1BQU0sRUFBRSxRQUFRO1lBQ2hCLGFBQWEsRUFBRSx5QkFBVyxDQUFDLG1DQUFxQixDQUFDLHNCQUFzQixDQUFDO1NBQ3hFLENBQUMsQ0FBQztRQUVILFFBQVEsQ0FBQyx3QkFBd0IsRUFBRSxDQUFDO1FBQ3BDLE1BQU0sQ0FBQyxlQUFlLEVBQUUsQ0FBQztRQUV6QixJQUFJLENBQUMsV0FBVyxDQUFDLFdBQVcsRUFBRSxJQUFJLE1BQU0sS0FBSyxXQUFXLEVBQUU7WUFDekQsTUFBTSxDQUFDLFdBQVcsRUFBRSxDQUFDO1NBQ3JCO0lBQ0YsQ0FBQyxDQUFDLENBQUMifQ==