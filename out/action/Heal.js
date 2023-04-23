define(["require", "exports", "game/IGame", "game/entity/EntityWithStats", "game/entity/IEntity", "game/entity/IStats", "game/entity/action/Action", "game/entity/action/IAction", "game/entity/player/IPlayer", "game/item/ItemReference", "../Actions", "./helpers/ResurrectCorpse"], function (require, exports, IGame_1, EntityWithStats_1, IEntity_1, IStats_1, Action_1, IAction_1, IPlayer_1, ItemReference_1, Actions_1, ResurrectCorpse_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = new Action_1.Action(IAction_1.ActionArgument.Entity, (0, IAction_1.optional)(IAction_1.ActionArgument.ItemArray), (0, IAction_1.optional)(IAction_1.ActionArgument.Object))
        .setUsableBy(IEntity_1.EntityType.Human)
        .setUsableWhen(...Actions_1.defaultUsability)
        .setHandler((action, entity, itemsToRestoreToInventory, equippedReferences) => {
        const corpse = entity.asCorpse;
        if (corpse) {
            if ((0, ResurrectCorpse_1.default)(action.executor, corpse)) {
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
        entity.setStatus(IEntity_1.StatusType.Frostbitten, false, IEntity_1.StatusEffectChangeReason.Passed);
        if (entity.asPlayer) {
            entity.asPlayer.state = IPlayer_1.PlayerState.None;
            entity.asPlayer.updateStatsAndAttributes();
            entity.asPlayer.setMoveType(IEntity_1.MoveType.Land);
            game.playing = true;
        }
        if (entity.asHuman?.inventory && itemsToRestoreToInventory) {
            const human = entity.asHuman;
            human.island.items.moveItemsToContainer(human, itemsToRestoreToInventory, human.inventory);
            if (equippedReferences) {
                for (const [equipType, itemReference] of Object.entries(equippedReferences)) {
                    const item = ItemReference_1.default.item(itemReference);
                    if (item) {
                        human.equip(item, +equipType);
                    }
                }
            }
        }
        action.setUpdateRender();
        Actions_1.default.DEBUG_TOOLS.updateFog();
        gameScreen?.onGameTickEnd(game, IGame_1.TickFlag.All);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSGVhbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hY3Rpb24vSGVhbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7SUFlQSxrQkFBZSxJQUFJLGVBQU0sQ0FBQyx3QkFBYyxDQUFDLE1BQU0sRUFBRSxJQUFBLGtCQUFRLEVBQUMsd0JBQWMsQ0FBQyxTQUFTLENBQUMsRUFBRSxJQUFBLGtCQUFRLEVBQUMsd0JBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUNuSCxXQUFXLENBQUMsb0JBQVUsQ0FBQyxLQUFLLENBQUM7U0FDN0IsYUFBYSxDQUFDLEdBQUcsMEJBQWdCLENBQUM7U0FDbEMsVUFBVSxDQUFDLENBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRSx5QkFBeUIsRUFBRSxrQkFBcUQsRUFBRSxFQUFFO1FBRWhILE1BQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUM7UUFDL0IsSUFBSSxNQUFNLEVBQUU7WUFDWCxJQUFJLElBQUEseUJBQWUsRUFBQyxNQUFNLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxFQUFFO2dCQUM3QyxNQUFNLENBQUMsZUFBZSxFQUFFLENBQUM7YUFDekI7WUFFRCxPQUFPO1NBQ1A7UUFFRCxJQUFJLENBQUMsQ0FBQyxNQUFNLFlBQVkseUJBQWUsQ0FBQyxFQUFFO1lBQ3pDLE9BQU87U0FDUDtRQUVELE1BQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFXLGFBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN0RCxNQUFNLE9BQU8sR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBVyxhQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDeEQsTUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQVcsYUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3RELE1BQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFXLGFB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