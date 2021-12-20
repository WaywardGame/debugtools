define(["require", "exports", "game/entity/action/Action", "game/entity/action/IAction", "game/entity/IEntity", "game/entity/IStats", "game/entity/player/IPlayer", "../Actions", "./helpers/ResurrectCorpse"], function (require, exports, Action_1, IAction_1, IEntity_1, IStats_1, IPlayer_1, Actions_1, ResurrectCorpse_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = new Action_1.Action((0, IAction_1.anyOf)(IAction_1.ActionArgument.Entity, IAction_1.ActionArgument.Corpse))
        .setUsableBy(IEntity_1.EntityType.Player)
        .setUsableWhen(...Actions_1.defaultUsability)
        .setHandler((action, entity) => {
        var _a, _b;
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
        entity.stat.set(health, (_b = (_a = entity.asPlayer) === null || _a === void 0 ? void 0 : _a.getMaxHealth()) !== null && _b !== void 0 ? _b : health.max);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSGVhbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hY3Rpb24vSGVhbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7SUFXQSxrQkFBZSxJQUFJLGVBQU0sQ0FBQyxJQUFBLGVBQUssRUFBQyx3QkFBYyxDQUFDLE1BQU0sRUFBRSx3QkFBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQzVFLFdBQVcsQ0FBQyxvQkFBVSxDQUFDLE1BQU0sQ0FBQztTQUM5QixhQUFhLENBQUMsR0FBRywwQkFBZ0IsQ0FBQztTQUNsQyxVQUFVLENBQUMsQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLEVBQUU7O1FBRTlCLElBQUksTUFBTSxDQUFDLGNBQWMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLHdCQUFjLENBQUMsTUFBTSxDQUFDLEVBQUU7WUFDNUQsSUFBSSxJQUFBLHlCQUFlLEVBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsRUFBRTtnQkFDN0MsTUFBTSxDQUFDLGVBQWUsRUFBRSxDQUFDO2FBQ3pCO1lBRUQsT0FBTztTQUNQO1FBRUQsTUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQVcsYUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3RELE1BQU0sT0FBTyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFXLGFBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUN4RCxNQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBVyxhQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDdEQsTUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQVcsYUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRXRELE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxNQUFBLE1BQUEsTUFBTSxDQUFDLFFBQVEsMENBQUUsWUFBWSxFQUFFLG1DQUFJLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN2RSxJQUFJLE9BQU87WUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ25ELElBQUksTUFBTTtZQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDaEQsSUFBSSxNQUFNO1lBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUVoRCxNQUFNLENBQUMsU0FBUyxDQUFDLG9CQUFVLENBQUMsUUFBUSxFQUFFLEtBQUssRUFBRSxrQ0FBd0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUM5RSxNQUFNLENBQUMsU0FBUyxDQUFDLG9CQUFVLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRSxrQ0FBd0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUM1RSxNQUFNLENBQUMsU0FBUyxDQUFDLG9CQUFVLENBQUMsUUFBUSxFQUFFLEtBQUssRUFBRSxrQ0FBd0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUU5RSxJQUFJLE1BQU0sQ0FBQyxRQUFRLEVBQUU7WUFDcEIsTUFBTSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEdBQUcscUJBQVcsQ0FBQyxJQUFJLENBQUM7WUFDekMsTUFBTSxDQUFDLFFBQVEsQ0FBQyx3QkFBd0IsRUFBRSxDQUFDO1lBQzNDLE1BQU0sUUFBUSxHQUFHLGlCQUFPLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxrQkFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsa0JBQVEsQ0FBQyxJQUFJLENBQUM7WUFDaEgsTUFBTSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUM7U0FDdEM7UUFFRCxNQUFNLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDckIsTUFBTSxDQUFDLGVBQWUsRUFBRSxDQUFDO1FBQ3pCLGlCQUFPLENBQUMsV0FBVyxDQUFDLFNBQVMsRUFBRSxDQUFDO0lBQ2pDLENBQUMsQ0FBQyxDQUFDIn0=