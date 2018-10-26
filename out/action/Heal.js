define(["require", "exports", "action/Action", "action/IAction", "entity/IBaseEntity", "entity/IEntity", "entity/IStats", "Enums", "newui/screen/IScreen", "../Actions", "./helpers/ResurrectCorpse"], function (require, exports, Action_1, IAction_1, IBaseEntity_1, IEntity_1, IStats_1, Enums_1, IScreen_1, Actions_1, ResurrectCorpse_1) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSGVhbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hY3Rpb24vSGVhbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7SUFjQSxrQkFBZSxJQUFJLGVBQU0sQ0FBQyxlQUFLLENBQUMsd0JBQWMsQ0FBQyxNQUFNLEVBQUUsd0JBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUM1RSxXQUFXLENBQUMsb0JBQVUsQ0FBQyxNQUFNLENBQUM7U0FDOUIsYUFBYSxDQUFDLEdBQUcsMEJBQWdCLENBQUM7U0FDbEMsVUFBVSxDQUFDLENBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRSxFQUFFO1FBRTlCLElBQUksTUFBTSxDQUFDLGNBQWMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLHdCQUFjLENBQUMsTUFBTSxDQUFDLEVBQUU7WUFDNUQsSUFBSSx5QkFBZSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLEVBQUU7Z0JBQzdDLE1BQU0sQ0FBQyxlQUFlLEVBQUUsQ0FBQzthQUN6QjtZQUVELE9BQU87U0FDUDtRQUVELE1BQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQVcsYUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3JELE1BQU0sT0FBTyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQVcsYUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3ZELE1BQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQVcsYUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3JELE1BQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQVcsYUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRXJELE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxVQUFVLEtBQUssb0JBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3JHLElBQUksT0FBTztZQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNsRCxJQUFJLE1BQU07WUFBRSxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDL0MsSUFBSSxNQUFNO1lBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBRS9DLE1BQU0sQ0FBQyxTQUFTLENBQUMsa0JBQVUsQ0FBQyxRQUFRLEVBQUUsS0FBSyxFQUFFLHNDQUF3QixDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzlFLE1BQU0sQ0FBQyxTQUFTLENBQUMsa0JBQVUsQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLHNDQUF3QixDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzVFLE1BQU0sQ0FBQyxTQUFTLENBQUMsa0JBQVUsQ0FBQyxRQUFRLEVBQUUsS0FBSyxFQUFFLHNDQUF3QixDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRTlFLElBQUksTUFBTSxDQUFDLFVBQVUsS0FBSyxvQkFBVSxDQUFDLE1BQU0sRUFBRTtZQUM1QyxNQUFNLENBQUMsS0FBSyxHQUFHLG1CQUFXLENBQUMsSUFBSSxDQUFDO1lBQ2hDLE1BQU0sQ0FBQyx3QkFBd0IsRUFBRSxDQUFDO1NBQ2xDO1FBRUQsTUFBTSxDQUFDLGVBQWUsRUFBRSxDQUFDO1FBQ3pCLGlCQUFPLENBQUMsV0FBVyxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQ2hDLEtBQUssQ0FBQyxTQUFTLENBQWEsa0JBQVEsQ0FBQyxJQUFJLENBQUUsQ0FBQyxhQUFhLEVBQUUsQ0FBQztJQUM3RCxDQUFDLENBQUMsQ0FBQyJ9