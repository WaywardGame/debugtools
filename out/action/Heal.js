/*!
 * Copyright 2011-2023 Unlok
 * https://www.unlok.ca
 *
 * Credits & Thanks:
 * https://www.unlok.ca/credits-thanks/
 *
 * Wayward is a copyrighted and licensed work. Modification and/or distribution of any source files is prohibited. If you wish to modify the game in any way, please refer to the modding guide:
 * https://github.com/WaywardGame/types/wiki
 */
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSGVhbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hY3Rpb24vSGVhbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7O0dBU0c7Ozs7SUFpQkgsa0JBQWUsSUFBSSxlQUFNLENBQUMsd0JBQWMsQ0FBQyxNQUFNLEVBQUUsSUFBQSxrQkFBUSxFQUFDLHdCQUFjLENBQUMsU0FBUyxDQUFDLEVBQUUsSUFBQSxrQkFBUSxFQUFDLHdCQUFjLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDbkgsV0FBVyxDQUFDLG9CQUFVLENBQUMsS0FBSyxDQUFDO1NBQzdCLGFBQWEsQ0FBQyxHQUFHLDBCQUFnQixDQUFDO1NBQ2xDLFVBQVUsQ0FBQyxDQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUUseUJBQXlCLEVBQUUsa0JBQXFELEVBQUUsRUFBRTtRQUVoSCxNQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDO1FBQy9CLElBQUksTUFBTSxFQUFFO1lBQ1gsSUFBSSxJQUFBLHlCQUFlLEVBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsRUFBRTtnQkFDN0MsTUFBTSxDQUFDLGVBQWUsRUFBRSxDQUFDO2FBQ3pCO1lBRUQsT0FBTztTQUNQO1FBRUQsSUFBSSxDQUFDLENBQUMsTUFBTSxZQUFZLHlCQUFlLENBQUMsRUFBRTtZQUN6QyxPQUFPO1NBQ1A7UUFFRCxNQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBVyxhQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDdEQsTUFBTSxPQUFPLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQVcsYUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3hELE1BQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFXLGFBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN0RCxNQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsSUFB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