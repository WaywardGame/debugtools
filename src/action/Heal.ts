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

import { TickFlag } from "game/IGame";
import EntityWithStats from "game/entity/EntityWithStats";
import { EntityType, MoveType, StatusEffectChangeReason, StatusType } from "game/entity/IEntity";
import { EquipType } from "game/entity/IHuman";
import { IStatMax, Stat } from "game/entity/IStats";
import { Action } from "game/entity/action/Action";
import { ActionArgument, optional } from "game/entity/action/IAction";
import { PlayerState } from "game/entity/player/IPlayer";
import ItemReference, { IItemReference } from "game/item/ItemReference";
import Actions, { defaultUsability } from "../Actions";
import ResurrectCorpse from "./helpers/ResurrectCorpse";

/**
 * The core stats, namely, Health, Stamina, Hunger, and Thirst, are all set to their maximum values. Any status effects are removed.
 */
export default new Action(ActionArgument.Entity, optional(ActionArgument.ItemArray), optional(ActionArgument.Object))
	.setUsableBy(EntityType.Human)
	.setUsableWhen(...defaultUsability)
	.setHandler((action, entity, itemsToRestoreToInventory, equippedReferences: Record<EquipType, IItemReference>) => {
		// resurrect corpses
		const corpse = entity.asCorpse;
		if (corpse) {
			if (ResurrectCorpse(action.executor, corpse)) {
				action.setUpdateRender();
			}

			return;
		}

		if (!(entity instanceof EntityWithStats)) {
			return;
		}

		const health = entity.stat.get<IStatMax>(Stat.Health);
		const stamina = entity.stat.get<IStatMax>(Stat.Stamina);
		const hunger = entity.stat.get<IStatMax>(Stat.Hunger);
		const thirst = entity.stat.get<IStatMax>(Stat.Thirst);

		entity.stat.set(health, entity.asHuman?.getMaxHealth() ?? health.max);
		if (stamina) entity.stat.set(stamina, stamina.max);
		if (hunger) entity.stat.set(hunger, hunger.max);
		if (thirst) entity.stat.set(thirst, thirst.max);

		entity.setStatus(StatusType.Bleeding, false, StatusEffectChangeReason.Passed);
		entity.setStatus(StatusType.Burned, false, StatusEffectChangeReason.Passed);
		entity.setStatus(StatusType.Poisoned, false, StatusEffectChangeReason.Passed);
		entity.setStatus(StatusType.Frostbitten, false, StatusEffectChangeReason.Passed);

		if (entity.asPlayer) {
			// i know you wanted to make it so noclip persisted after death but you're going to have to make noclip an option instead
			// with this commented code it makes it so that you always respawn flying whether or not you were noclipping before
			// const moveType = entity.asPlayer.isFlying ? MoveType.Flying : MoveType.Land;
			entity.asPlayer.state = PlayerState.None;
			entity.asPlayer.updateStatsAndAttributes();
			entity.asPlayer.setMoveType(MoveType.Land);
			game.playing = true;
		}

		if (entity.asHuman?.inventory && itemsToRestoreToInventory) {
			const human = entity.asHuman;

			human.island.items.moveItemsToContainer(human, itemsToRestoreToInventory, human.inventory);

			if (equippedReferences) {
				for (const [equipType, itemReference] of Object.entries(equippedReferences)) {
					const item = ItemReference.item(itemReference);
					if (item) {
						human.equip(item, +equipType as EquipType);
					}
				}
			}
		}

		action.setUpdateRender();
		Actions.DEBUG_TOOLS.updateFog();
		gameScreen?.onGameTickEnd(game, TickFlag.All);
	});
