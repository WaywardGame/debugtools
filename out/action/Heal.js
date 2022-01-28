define(["require", "exports", "game/entity/action/Action", "game/entity/action/IAction", "game/entity/IEntity", "game/entity/IStats", "game/entity/player/IPlayer", "../Actions", "./helpers/ResurrectCorpse"], function (require, exports, Action_1, IAction_1, IEntity_1, IStats_1, IPlayer_1, Actions_1, ResurrectCorpse_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = new Action_1.Action((0, IAction_1.anyOf)(IAction_1.ActionArgument.Entity, IAction_1.ActionArgument.Corpse))
        .setUsableBy(IEntity_1.EntityType.Player)
        .setUsableWhen(...Actions_1.defaultUsability)
        .setHandler((action, entity) => {
        if (action.isArgumentType(entity, 0, IAction_1.ActionArgument.Corpse)) {
            if ((0, ResurrectCorpse_1.default)(action.executor, entity)) {
                action.setUpdateRender();
            }
            return;
        }
        const health = entity.stat.get(IStats_1.Stat.Health);
        const stamina = entity.stat.get(IStats_1.Stat.Stamina);
        const hunger = entity.stat.get(IStats_1.Stat.Hunger);
        const thirst = entity.stat.get(IStats_1.Stat.Thirst);
        entity.stat.set(health, entity.asPlayer?.getMaxHealth() ?? health.max);
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
            entity.asPlayer.state = IPlayer_1.PlayerState.None;
            entity.asPlayer.updateStatsAndAttributes();
            const moveType = Actions_1.default.DEBUG_TOOLS.getPlayerData(entity.asPlayer, "noclip") ? IEntity_1.MoveType.Flying : IEntity_1.MoveType.Land;
            entity.asPlayer.setMoveType(moveType);
        }
        action.setPassTurn();
        action.setUpdateRender();
        Actions_1.default.DEBUG_TOOLS.updateFog();
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSGVhbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hY3Rpb24vSGVhbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7SUFXQSxrQkFBZSxJQUFJLGVBQU0sQ0FBQyxJQUFBLGVBQUssRUFBQyx3QkFBYyxDQUFDLE1BQU0sRUFBRSx3QkFBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQzVFLFdBQVcsQ0FBQyxvQkFBVSxDQUFDLE1BQU0sQ0FBQztTQUM5QixhQUFhLENBQUMsR0FBRywwQkFBZ0IsQ0FBQztTQUNsQyxVQUFVLENBQUMsQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLEVBQUU7UUFFOUIsSUFBSSxNQUFNLENBQUMsY0FBYyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsd0JBQWMsQ0FBQyxNQUFNLENBQUMsRUFBRTtZQUM1RCxJQUFJLElBQUEseUJBQWUsRUFBQyxNQUFNLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxFQUFFO2dCQUM3QyxNQUFNLENBQUMsZUFBZSxFQUFFLENBQUM7YUFDekI7WUFFRCxPQUFPO1NBQ1A7UUFFRCxNQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBVyxhQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDdEQsTUFBTSxPQUFPLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQVcsYUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3hELE1BQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFXLGFBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN0RCxNQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBVyxhQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFdEQsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxRQUFRLEVBQUUsWUFBWSxFQUFFLElBQUksTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3ZFLElBQUksT0FBTztZQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDbkQsSUFBSSxNQUFNO1lBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNoRCxJQUFJLE1BQU07WUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBRWhELE1BQU0sQ0FBQyxTQUFTLENBQUMsb0JBQVUsQ0FBQyxRQUFRLEVBQUUsS0FBSyxFQUFFLGtDQUF3QixDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzlFLE1BQU0sQ0FBQyxTQUFTLENBQUMsb0JBQVUsQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLGtDQUF3QixDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzVFLE1BQU0sQ0FBQyxTQUFTLENBQUMsb0JBQVUsQ0FBQyxRQUFRLEVBQUUsS0FBSyxFQUFFLGtDQUF3QixDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRTlFLElBQUksTUFBTSxDQUFDLFFBQVEsRUFBRTtZQUNwQixNQUFNLENBQUMsUUFBUSxDQUFDLEtBQUssR0FBRyxxQkFBVyxDQUFDLElBQUksQ0FBQztZQUN6QyxNQUFNLENBQUMsUUFBUSxDQUFDLHdCQUF3QixFQUFFLENBQUM7WUFDM0MsTUFBTSxRQUFRLEdBQUcsaUJBQU8sQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLGtCQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxrQkFBUSxDQUFDLElBQUksQ0FBQztZQUNoSCxNQUFNLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQztTQUN0QztRQUVELE1BQU0sQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUNyQixNQUFNLENBQUMsZUFBZSxFQUFFLENBQUM7UUFDekIsaUJBQU8sQ0FBQyxXQUFXLENBQUMsU0FBUyxFQUFFLENBQUM7SUFDakMsQ0FBQyxDQUFDLENBQUMifQ==