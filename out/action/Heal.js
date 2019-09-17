define(["require", "exports", "entity/action/Action", "entity/action/IAction", "entity/Entity", "entity/IEntity", "entity/IStats", "entity/player/IPlayer", "newui/screen/screens/GameScreen", "../Actions", "./helpers/ResurrectCorpse"], function (require, exports, Action_1, IAction_1, Entity_1, IEntity_1, IStats_1, IPlayer_1, GameScreen_1, Actions_1, ResurrectCorpse_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = new Action_1.Action(IAction_1.anyOf(IAction_1.ActionArgument.Entity, IAction_1.ActionArgument.Corpse))
        .setUsableBy(IEntity_1.EntityType.Player)
        .setUsableWhen(...Actions_1.defaultUsability)
        .setHandler((action, entity) => {
        if (action.isArgumentType(entity, 0, IAction_1.ActionArgument.Corpse)) {
            if (ResurrectCorpse_1.default(action.executor, entity)) {
                action.setUpdateRender();
            }
            return;
        }
        const health = entity.getStat(IStats_1.Stat.Health);
        const stamina = entity.getStat(IStats_1.Stat.Stamina);
        const hunger = entity.getStat(IStats_1.Stat.Hunger);
        const thirst = entity.getStat(IStats_1.Stat.Thirst);
        entity.setStat(health, Entity_1.default.is(entity, IEntity_1.EntityType.Player) ? entity.getMaxHealth() : health.max);
        if (stamina)
            entity.setStat(stamina, stamina.max);
        if (hunger)
            entity.setStat(hunger, hunger.max);
        if (thirst)
            entity.setStat(thirst, thirst.max);
        entity.setStatus(IEntity_1.StatusType.Bleeding, false, IEntity_1.StatusEffectChangeReason.Passed);
        entity.setStatus(IEntity_1.StatusType.Burned, false, IEntity_1.StatusEffectChangeReason.Passed);
        entity.setStatus(IEntity_1.StatusType.Poisoned, false, IEntity_1.StatusEffectChangeReason.Passed);
        if (Entity_1.default.is(entity, IEntity_1.EntityType.Player)) {
            entity.state = IPlayer_1.PlayerState.None;
            entity.updateStatsAndAttributes();
        }
        action.setUpdateRender();
        Actions_1.default.DEBUG_TOOLS.updateFog();
        GameScreen_1.gameScreen.onGameTickEnd();
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSGVhbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hY3Rpb24vSGVhbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7SUFhQSxrQkFBZSxJQUFJLGVBQU0sQ0FBQyxlQUFLLENBQUMsd0JBQWMsQ0FBQyxNQUFNLEVBQUUsd0JBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUM1RSxXQUFXLENBQUMsb0JBQVUsQ0FBQyxNQUFNLENBQUM7U0FDOUIsYUFBYSxDQUFDLEdBQUcsMEJBQWdCLENBQUM7U0FDbEMsVUFBVSxDQUFDLENBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRSxFQUFFO1FBRTlCLElBQUksTUFBTSxDQUFDLGNBQWMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLHdCQUFjLENBQUMsTUFBTSxDQUFDLEVBQUU7WUFDNUQsSUFBSSx5QkFBZSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLEVBQUU7Z0JBQzdDLE1BQU0sQ0FBQyxlQUFlLEVBQUUsQ0FBQzthQUN6QjtZQUVELE9BQU87U0FDUDtRQUVELE1BQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQVcsYUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3JELE1BQU0sT0FBTyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQVcsYUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3ZELE1BQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQVcsYUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3JELE1BQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQVcsYUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRXJELE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLGdCQUFNLENBQUMsRUFBRSxDQUFDLE1BQU0sRUFBRSxvQkFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNsRyxJQUFJLE9BQU87WUFBRSxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDbEQsSUFBSSxNQUFNO1lBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQy9DLElBQUksTUFBTTtZQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUUvQyxNQUFNLENBQUMsU0FBUyxDQUFDLG9CQUFVLENBQUMsUUFBUSxFQUFFLEtBQUssRUFBRSxrQ0FBd0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUM5RSxNQUFNLENBQUMsU0FBUyxDQUFDLG9CQUFVLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRSxrQ0FBd0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUM1RSxNQUFNLENBQUMsU0FBUyxDQUFDLG9CQUFVLENBQUMsUUFBUSxFQUFFLEtBQUssRUFBRSxrQ0FBd0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUU5RSxJQUFJLGdCQUFNLENBQUMsRUFBRSxDQUFDLE1BQU0sRUFBRSxvQkFBVSxDQUFDLE1BQU0sQ0FBQyxFQUFFO1lBQ3pDLE1BQU0sQ0FBQyxLQUFLLEdBQUcscUJBQVcsQ0FBQyxJQUFJLENBQUM7WUFDaEMsTUFBTSxDQUFDLHdCQUF3QixFQUFFLENBQUM7U0FDbEM7UUFFRCxNQUFNLENBQUMsZUFBZSxFQUFFLENBQUM7UUFDekIsaUJBQU8sQ0FBQyxXQUFXLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDaEMsdUJBQVcsQ0FBQyxhQUFhLEVBQUUsQ0FBQztJQUM3QixDQUFDLENBQUMsQ0FBQyJ9