define(["require", "exports", "game/entity/action/Action", "game/entity/action/IAction", "game/entity/IEntity", "../Actions", "../IDebugTools"], function (require, exports, Action_1, IAction_1, IEntity_1, Actions_1, IDebugTools_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = new Action_1.Action(IAction_1.ActionArgument.Entity)
        .setUsableBy(IEntity_1.EntityType.Player)
        .setUsableWhen(...Actions_1.defaultUsability)
        .setHandler((action, entity) => {
        (entity?.asHuman ?? entity?.asCreature)?.damage({
            type: IEntity_1.DamageType.True,
            amount: Infinity,
            damageMessage: (0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.KillEntityDeathMessage),
        });
        renderers.computeSpritesInViewport(entity);
        action.setUpdateRender();
        if (!multiplayer.isConnected() && entity.asPlayer?.isLocalPlayer()) {
            action.setPassTurn();
        }
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiS2lsbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hY3Rpb24vS2lsbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7SUFTQSxrQkFBZSxJQUFJLGVBQU0sQ0FBQyx3QkFBYyxDQUFDLE1BQU0sQ0FBQztTQUM5QyxXQUFXLENBQUMsb0JBQVUsQ0FBQyxNQUFNLENBQUM7U0FDOUIsYUFBYSxDQUFDLEdBQUcsMEJBQWdCLENBQUM7U0FDbEMsVUFBVSxDQUFDLENBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRSxFQUFFO1FBQzlCLENBQUMsTUFBTSxFQUFFLE9BQU8sSUFBSSxNQUFNLEVBQUUsVUFBVSxDQUFDLEVBQUUsTUFBTSxDQUFDO1lBQy9DLElBQUksRUFBRSxvQkFBVSxDQUFDLElBQUk7WUFDckIsTUFBTSxFQUFFLFFBQVE7WUFDaEIsYUFBYSxFQUFFLElBQUEseUJBQVcsRUFBQyxtQ0FBcUIsQ0FBQyxzQkFBc0IsQ0FBQztTQUN4RSxDQUFDLENBQUM7UUFFSCxTQUFTLENBQUMsd0JBQXdCLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDM0MsTUFBTSxDQUFDLGVBQWUsRUFBRSxDQUFDO1FBRXpCLElBQUksQ0FBQyxXQUFXLENBQUMsV0FBVyxFQUFFLElBQUksTUFBTSxDQUFDLFFBQVEsRUFBRSxhQUFhLEVBQUUsRUFBRTtZQUNuRSxNQUFNLENBQUMsV0FBVyxFQUFFLENBQUM7U0FDckI7SUFDRixDQUFDLENBQUMsQ0FBQyJ9