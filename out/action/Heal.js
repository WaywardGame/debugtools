define(["require", "exports", "action/Action", "action/IAction", "entity/BaseEntity", "entity/IBaseEntity", "entity/IEntity", "entity/IStats", "Enums", "newui/screen/IScreen", "../Actions", "./helpers/ResurrectCorpse"], function (require, exports, Action_1, IAction_1, BaseEntity_1, IBaseEntity_1, IEntity_1, IStats_1, Enums_1, IScreen_1, Actions_1, ResurrectCorpse_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = new Action_1.Action(IAction_1.anyOf(IAction_1.ActionArgument.Entity, IAction_1.ActionArgument.Corpse))
        .setUsableBy(IEntity_1.EntityType.Player)
        .setUsableWhen(...Actions_1.defaultUsability)
        .setHandler((action, entityOrCorpse) => {
        if (!(entityOrCorpse instanceof BaseEntity_1.default)) {
            if (ResurrectCorpse_1.default(action.executor, entityOrCorpse)) {
                action.setUpdateRender();
            }
            return;
        }
        const entity = entityOrCorpse;
        const health = entity.getStat(IStats_1.Stat.Health);
        const stamina = entity.getStat(IStats_1.Stat.Stamina);
        const hunger = entity.getStat(IStats_1.Stat.Hunger);
        const thirst = entity.getStat(IStats_1.Stat.Thirst);
        entity.setStat(health, entity.entityType === IEntity_1.EntityType.Player ? entity.getMaxHealth() : health.max);
        if (stamina)
            entity.setStat(stamina, stamina.max);
        if (hunger)
            entity.setStat(hunger, hunger.max);
        if (thirst)
            entity.setStat(thirst, thirst.max);
        entity.setStatus(Enums_1.StatusType.Bleeding, false, IBaseEntity_1.StatusEffectChangeReason.Passed);
        entity.setStatus(Enums_1.StatusType.Burned, false, IBaseEntity_1.StatusEffectChangeReason.Passed);
        entity.setStatus(Enums_1.StatusType.Poisoned, false, IBaseEntity_1.StatusEffectChangeReason.Passed);
        if (entity.entityType === IEntity_1.EntityType.Player) {
            entity.state = Enums_1.PlayerState.None;
            entity.updateStatsAndAttributes();
        }
        action.setUpdateRender();
        Actions_1.default.DEBUG_TOOLS.updateFog();
        newui.getScreen(IScreen_1.ScreenId.Game).onGameTickEnd();
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSGVhbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hY3Rpb24vSGVhbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7SUFnQkEsa0JBQWUsSUFBSSxlQUFNLENBQUMsZUFBSyxDQUFDLHdCQUFjLENBQUMsTUFBTSxFQUFFLHdCQUFjLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDNUUsV0FBVyxDQUFDLG9CQUFVLENBQUMsTUFBTSxDQUFDO1NBQzlCLGFBQWEsQ0FBQyxHQUFHLDBCQUFnQixDQUFDO1NBQ2xDLFVBQVUsQ0FBQyxDQUFDLE1BQU0sRUFBRSxjQUFjLEVBQUUsRUFBRTtRQUd0QyxJQUFJLENBQUMsQ0FBQyxjQUFjLFlBQVksb0JBQVUsQ0FBQyxFQUFFO1lBQzVDLElBQUkseUJBQWUsQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLGNBQXlCLENBQUMsRUFBRTtnQkFDaEUsTUFBTSxDQUFDLGVBQWUsRUFBRSxDQUFDO2FBQ3pCO1lBRUQsT0FBTztTQUNQO1FBRUQsTUFBTSxNQUFNLEdBQUcsY0FBd0IsQ0FBQztRQUV4QyxNQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFXLGFBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNyRCxNQUFNLE9BQU8sR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFXLGFBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUN2RCxNQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFXLGFBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNyRCxNQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFXLGFBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUVyRCxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsVUFBVSxLQUFLLG9CQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNyRyxJQUFJLE9BQU87WUFBRSxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDbEQsSUFBSSxNQUFNO1lBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQy9DLElBQUksTUFBTTtZQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUUvQyxNQUFNLENBQUMsU0FBUyxDQUFDLGtCQUFVLENBQUMsUUFBUSxFQUFFLEtBQUssRUFBRSxzQ0FBd0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUM5RSxNQUFNLENBQUMsU0FBUyxDQUFDLGtCQUFVLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRSxzQ0FBd0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUM1RSxNQUFNLENBQUMsU0FBUyxDQUFDLGtCQUFVLENBQUMsUUFBUSxFQUFFLEtBQUssRUFBRSxzQ0FBd0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUU5RSxJQUFJLE1BQU0sQ0FBQyxVQUFVLEtBQUssb0JBQVUsQ0FBQyxNQUFNLEVBQUU7WUFDNUMsTUFBTSxDQUFDLEtBQUssR0FBRyxtQkFBVyxDQUFDLElBQUksQ0FBQztZQUNoQyxNQUFNLENBQUMsd0JBQXdCLEVBQUUsQ0FBQztTQUNsQztRQUVELE1BQU0sQ0FBQyxlQUFlLEVBQUUsQ0FBQztRQUN6QixpQkFBTyxDQUFDLFdBQVcsQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUNoQyxLQUFLLENBQUMsU0FBUyxDQUFhLGtCQUFRLENBQUMsSUFBSSxDQUFFLENBQUMsYUFBYSxFQUFFLENBQUM7SUFDN0QsQ0FBQyxDQUFDLENBQUMifQ==