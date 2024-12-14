import { TickFlag } from "@wayward/game/game/IGame";
import EntityWithStats from "@wayward/game/game/entity/EntityWithStats";
import { EntityType, MoveType, StatusChangeReason } from "@wayward/game/game/entity/IEntity";
import type { EquipType } from "@wayward/game/game/entity/IHuman";
import type { IStatMax } from "@wayward/game/game/entity/IStats";
import { Stat } from "@wayward/game/game/entity/IStats";
import { Action } from "@wayward/game/game/entity/action/Action";
import { ActionArgument, ActionUsability } from "@wayward/game/game/entity/action/IAction";
import { PlayerState } from "@wayward/game/game/entity/player/IPlayer";
import { StatusType } from "@wayward/game/game/entity/status/IStatus";
import type { IItemReference } from "@wayward/game/game/item/ItemReference";
import ItemReference from "@wayward/game/game/item/ItemReference";
import { RenderSource, UpdateRenderFlag } from "@wayward/game/renderer/IRenderer";
import Actions, { defaultCanUseHandler } from "../Actions";
import ResurrectCorpse from "./helpers/ResurrectCorpse";

/**
 * The core stats, namely, Health, Stamina, Hunger, and Thirst, are all set to their maximum values. Any status effects are removed.
 */
export default new Action(ActionArgument.Entity, ActionArgument.OPTIONAL(ActionArgument.ItemArray), ActionArgument.OPTIONAL(ActionArgument.Object))
	.setUsableBy(EntityType.Human)
	.setUsableWhen(ActionUsability.Always)
	.setCanUse(defaultCanUseHandler)
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
		if (stamina) {
			entity.stat.set(stamina, stamina.max);
		}

		if (hunger) {
			entity.stat.set(hunger, hunger.max);
		}

		if (thirst) {
			entity.stat.set(thirst, thirst.max);
		}

		entity.setStatus(StatusType.Bleeding, false, StatusChangeReason.Passed);
		entity.setStatus(StatusType.Burned, false, StatusChangeReason.Passed);
		entity.setStatus(StatusType.Poisoned, false, StatusChangeReason.Passed);
		entity.setStatus(StatusType.Frostbitten, false, StatusChangeReason.Passed);

		if (entity.asPlayer) {
			// i know you wanted to make it so noclip persisted after death but you're going to have to make noclip an option instead
			// with this commented code it makes it so that you always respawn flying whether or not you were noclipping before
			// const moveType = entity.asPlayer.isFlying ? MoveType.Flying : MoveType.Land;

			// Revive player
			if (entity.asPlayer.state === PlayerState.Dead || entity.asPlayer.isGhost) {
				entity.asPlayer.state = PlayerState.None;
				entity.asPlayer.setMoveType(MoveType.Land);

				if (entity.isLocalPlayer && renderer) {
					renderer.fieldOfView.disabled = false;
					renderer.updateRender(RenderSource.Mod, UpdateRenderFlag.FieldOfView | UpdateRenderFlag.FieldOfViewForced);
				}
			}

			entity.asPlayer.updateStatsAndAttributes();
			game.playing = true;
		}

		if (entity.asHuman?.inventory && itemsToRestoreToInventory) {
			const human = entity.asHuman;

			for (const containables of human.island.items.getContainers(itemsToRestoreToInventory).values()) {
				// must move from one container at a time
				human.island.items.moveItemsToContainer(human, containables, human.inventory);
			}

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
		gameScreen?.onIslandTickEnd(entity.island, { ticks: 1, tickFlags: TickFlag.All });
	});
