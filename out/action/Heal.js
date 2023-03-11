define(["require", "exports", "game/entity/action/Action", "game/entity/action/IAction", "game/entity/EntityWithStats", "game/entity/IEntity", "game/entity/IStats", "game/entity/player/IPlayer", "game/IGame", "../Actions", "./helpers/ResurrectCorpse"], function (require, exports, Action_1, IAction_1, EntityWithStats_1, IEntity_1, IStats_1, IPlayer_1, IGame_1, Actions_1, ResurrectCorpse_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = new Action_1.Action((0, IAction_1.anyOf)(IAction_1.ActionArgument.Entity, IAction_1.ActionArgument.Corpse))
        .setUsableBy(IEntity_1.EntityType.Human)
        .setUsableWhen(...Actions_1.defaultUsability)
        .setHandler((action, entity) => {
        if (action.isArgumentType(entity, 0, IAction_1.ActionArgument.Corpse)) {
            if ((0, ResurrectCorpse_1.default)(action.executor, entity)) {
                action.setUpdateRender();
            }
            return;
        }
        if (!(entity instanceof EntityWithStats_1.default)) {
            return;
        }
        const health = entity.stat.get(IStats_1.Stat.Health);
        const stamina = entity.stat.get(IStats_1.Stat.Stamina);
        const hunger = entity.stat.get(IStats_1.Stat.Hunger);
        const thirst = entity.stat.get(IStats_1.Stat.Thirst);
        entity.stat.set(health, entity.asHuman?.getMaxHealth() ?? health.max);
        if (stamina)
            entity.stat.set(stamina, stamina.max);
        if (hunger)
            entity.stat.set(hunger, hunger.max);
        if (thirst)
            entity.stat.set(thirst, thirst.max);
        entity.setStatus(IEntity_1.StatusType.Bleeding, false, IEntity_1.StatusEffectChangeReason.Passed);
        entity.setStatus(IEntity_1.StatusType.Burned, false, IEntity_1.StatusEffectChangeReason.Passed);
        entity.setStatus(IEntity_1.StatusType.Poisoned, false, IEntity_1.StatusEffectChangeReason.Passed);
        if (entity.asPlayer) {
            const moveType = entity.asPlayer.isFlying ? IEntity_1.MoveType.Flying : IEntity_1.MoveType.Land;
            entity.asPlayer.state = IPlayer_1.PlayerState.None;
            entity.asPlayer.updateStatsAndAttributes();
            entity.asPlayer.setMoveType(moveType);
        }
        action.setUpdateRender();
        Actions_1.default.DEBUG_TOOLS.updateFog();
        gameScreen?.onGameTickEnd(game, IGame_1.TickFlag.All);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSGVhbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hY3Rpb24vSGVhbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7SUFhQSxrQkFBZSxJQUFJLGVBQU0sQ0FBQyxJQUFBLGVBQUssRUFBQyx3QkFBYyxDQUFDLE1BQU0sRUFBRSx3QkFBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQzVFLFdBQVcsQ0FBQyxvQkFBVSxDQUFDLEtBQUssQ0FBQztTQUM3QixhQUFhLENBQUMsR0FBRywwQkFBZ0IsQ0FBQztTQUNsQyxVQUFVLENBQUMsQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLEVBQUU7UUFFOUIsSUFBSSxNQUFNLENBQUMsY0FBYyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsd0JBQWMsQ0FBQyxNQUFNLENBQUMsRUFBRTtZQUM1RCxJQUFJLElBQUEseUJBQWUsRUFBQyxNQUFNLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxFQUFFO2dCQUM3QyxNQUFNLENBQUMsZUFBZSxFQUFFLENBQUM7YUFDekI7WUFFRCxPQUFPO1NBQ1A7UUFFRCxJQUFJLENBQUMsQ0FBQyxNQUFNLFlBQVkseUJBQWUsQ0FBQyxFQUFFO1lBQ3pDLE9BQU87U0FDUDtRQUVELE1BQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFXLGFBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN0RCxNQUFNLE9BQU8sR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBVyxhQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDeEQsTUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQVcsYUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3RELE1BQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFXLGFBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUV0RCxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLE9BQU8sRUFBRSxZQUFZLEVBQUUsSUFBSSxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDdEUsSUFBSSxPQUFPO1lBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNuRCxJQUFJLE1BQU07WUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2hELElBQUksTUFBTTtZQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7UUFFaEQsTUFBTSxDQUFDLFNBQVMsQ0FBQyxvQkFBVSxDQUFDLFFBQVEsRUFBRSxLQUFLLEVBQUUsa0NBQXdCLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDOUUsTUFBTSxDQUFDLFNBQVMsQ0FBQyxvQkFBVSxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsa0NBQXdCLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDNUUsTUFBTSxDQUFDLFNBQVMsQ0FBQyxvQkFBVSxDQUFDLFFBQVEsRUFBRSxLQUFLLEVBQUUsa0NBQXdCLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFOUUsSUFBSSxNQUFNLENBQUMsUUFBUSxFQUFFO1lBQ3BCLE1BQU0sUUFBUSxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxrQkFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsa0JBQVEsQ0FBQyxJQUFJLENBQUM7WUFDNUUsTUFBTSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEdBQUcscUJBQVcsQ0FBQyxJQUFJLENBQUM7WUFDekMsTUFBTSxDQUFDLFFBQVEsQ0FBQyx3QkFBd0IsRUFBRSxDQUFDO1lBQzNDLE1BQU0sQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1NBQ3RDO1FBRUQsTUFBTSxDQUFDLGVBQWUsRUFBRSxDQUFDO1FBQ3pCLGlCQUFPLENBQUMsV0FBVyxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQ2hDLFVBQVUsRUFBRSxhQUFhLENBQUMsSUFBSSxFQUFFLGdCQUFRLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDL0MsQ0FBQyxDQUFDLENBQUMifQ==