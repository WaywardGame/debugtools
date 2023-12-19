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
define(["require", "exports", "@wayward/game/game/IGame", "@wayward/game/game/entity/EntityWithStats", "@wayward/game/game/entity/IEntity", "@wayward/game/game/entity/IStats", "@wayward/game/game/entity/action/Action", "@wayward/game/game/entity/action/IAction", "@wayward/game/game/entity/player/IPlayer", "@wayward/game/game/item/ItemReference", "../Actions", "./helpers/ResurrectCorpse", "@wayward/game/renderer/IRenderer"], function (require, exports, IGame_1, EntityWithStats_1, IEntity_1, IStats_1, Action_1, IAction_1, IPlayer_1, ItemReference_1, Actions_1, ResurrectCorpse_1, IRenderer_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = new Action_1.Action(IAction_1.ActionArgument.Entity, IAction_1.ActionArgument.OPTIONAL(IAction_1.ActionArgument.ItemArray), IAction_1.ActionArgument.OPTIONAL(IAction_1.ActionArgument.Object))
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
            if (entity.asPlayer.state === IPlayer_1.PlayerState.Dead || entity.asPlayer.isGhost) {
                entity.asPlayer.state = IPlayer_1.PlayerState.None;
                entity.asPlayer.setMoveType(IEntity_1.MoveType.Land);
                if (entity.isLocalPlayer && renderer) {
                    renderer.fieldOfView.disabled = false;
                    renderer.updateRender(IRenderer_1.RenderSource.Mod, IRenderer_1.UpdateRenderFlag.FieldOfView | IRenderer_1.UpdateRenderFlag.FieldOfViewForced);
                }
            }
            entity.asPlayer.updateStatsAndAttributes();
            game.playing = true;
        }
        if (entity.asHuman?.inventory && itemsToRestoreToInventory) {
            const human = entity.asHuman;
            for (const containables of human.island.items.getContainers(itemsToRestoreToInventory).values()) {
                human.island.items.moveItemsToContainer(human, containables, human.inventory);
            }
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
        gameScreen?.onIslandTickEnd(entity.island, IGame_1.TickFlag.All);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSGVhbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hY3Rpb24vSGVhbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7O0dBU0c7Ozs7SUFrQkgsa0JBQWUsSUFBSSxlQUFNLENBQUMsd0JBQWMsQ0FBQyxNQUFNLEVBQUUsd0JBQWMsQ0FBQyxRQUFRLENBQUMsd0JBQWMsQ0FBQyxTQUFTLENBQUMsRUFBRSx3QkFBYyxDQUFDLFFBQVEsQ0FBQyx3QkFBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQ2pKLFdBQVcsQ0FBQyxvQkFBVSxDQUFDLEtBQUssQ0FBQztTQUM3QixhQUFhLENBQUMsR0FBRywwQkFBZ0IsQ0FBQztTQUNsQyxVQUFVLENBQUMsQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLHlCQUF5QixFQUFFLGtCQUFxRCxFQUFFLEVBQUU7UUFFaEgsTUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQztRQUMvQixJQUFJLE1BQU0sRUFBRSxDQUFDO1lBQ1osSUFBSSxJQUFBLHlCQUFlLEVBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsRUFBRSxDQUFDO2dCQUM5QyxNQUFNLENBQUMsZUFBZSxFQUFFLENBQUM7WUFDMUIsQ0FBQztZQUVELE9BQU87UUFDUixDQUFDO1FBRUQsSUFBSSxDQUFDLENBQUMsTUFBTSxZQUFZLHlCQUFlLENBQUMsRUFBRSxDQUFDO1lBQzFDLE9BQU87UUFDUixDQUFDO1FBRUQsTUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQVcsYUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3RELE1BQU0sT0FBTyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFXLGFBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUN4RCxNQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBVyxhQUFJLENBQUMsTUFBTSxDQUFD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