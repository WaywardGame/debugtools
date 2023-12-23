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
        .setCanUse(Actions_1.defaultCanUseHandler)
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
        gameScreen?.onIslandTickEnd(entity.island, { ticks: 1, tickFlags: IGame_1.TickFlag.All });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSGVhbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hY3Rpb24vSGVhbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7O0dBU0c7Ozs7SUFrQkgsa0JBQWUsSUFBSSxlQUFNLENBQUMsd0JBQWMsQ0FBQyxNQUFNLEVBQUUsd0JBQWMsQ0FBQyxRQUFRLENBQUMsd0JBQWMsQ0FBQyxTQUFTLENBQUMsRUFBRSx3QkFBYyxDQUFDLFFBQVEsQ0FBQyx3QkFBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQ2pKLFdBQVcsQ0FBQyxvQkFBVSxDQUFDLEtBQUssQ0FBQztTQUM3QixhQUFhLENBQUMsR0FBRywwQkFBZ0IsQ0FBQztTQUNsQyxTQUFTLENBQUMsOEJBQW9CLENBQUM7U0FDL0IsVUFBVSxDQUFDLENBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRSx5QkFBeUIsRUFBRSxrQkFBcUQsRUFBRSxFQUFFO1FBRWhILE1BQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUM7UUFDL0IsSUFBSSxNQUFNLEVBQUUsQ0FBQztZQUNaLElBQUksSUFBQSx5QkFBZSxFQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLEVBQUUsQ0FBQztnQkFDOUMsTUFBTSxDQUFDLGVBQWUsRUFBRSxDQUFDO1lBQzFCLENBQUM7WUFFRCxPQUFPO1FBQ1IsQ0FBQztRQUVELElBQUksQ0FBQyxDQUFDLE1BQU0sWUFBWSx5QkFBZSxDQUFDLEVBQUUsQ0FBQztZQUMxQyxPQUFPO1FBQ1IsQ0FBQztRQUVELE1BQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFXLGFBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN0RCxNQUFNLE9BQU8sR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBVyxhQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDeEQsTUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxH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