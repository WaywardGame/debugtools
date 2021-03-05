import { Action } from "game/entity/action/Action";
import { ActionArgument, anyOf } from "game/entity/action/IAction";
import { EntityType, MoveType, StatusEffectChangeReason, StatusType } from "game/entity/IEntity";
import { IStatMax, Stat } from "game/entity/IStats";
import { PlayerState } from "game/entity/player/IPlayer";
import { gameScreen } from "ui/screen/screens/GameScreen";
import Actions, { defaultUsability } from "../Actions";
import ResurrectCorpse from "./helpers/ResurrectCorpse";

/**
 * The core stats, namely, Health, Stamina, Hunger, and Thirst, are all set to their maximum values. Any status effects are removed.
 */
export default new Action(anyOf(ActionArgument.Entity, ActionArgument.Corpse))
	.setUsableBy(EntityType.Player)
	.setUsableWhen(...defaultUsability)
	.setHandler((action, entity) => {
		// resurrect corpses
		if (action.isArgumentType(entity, 0, ActionArgument.Corpse)) {
			if (ResurrectCorpse(action.executor, entity)) {
				action.setUpdateRender();
			}

			return;
		}

		const health = entity.stat.get<IStatMax>(Stat.Health);
		const stamina = entity.stat.get<IStatMax>(Stat.Stamina);
		const hunger = entity.stat.get<IStatMax>(Stat.Hunger);
		const thirst = entity.stat.get<IStatMax>(Stat.Thirst);

		entity.stat.set(health, entity.asPlayer?.getMaxHealth() ?? health.max);
		if (stamina) entity.stat.set(stamina, stamina.max);
		if (hunger) entity.stat.set(hunger, hunger.max);
		if (thirst) entity.stat.set(thirst, thirst.max);

		entity.setStatus(StatusType.Bleeding, false, StatusEffectChangeReason.Passed);
		entity.setStatus(StatusType.Burned, false, StatusEffectChangeReason.Passed);
		entity.setStatus(StatusType.Poisoned, false, StatusEffectChangeReason.Passed);

		if (entity.asPlayer) {
			entity.asPlayer.state = PlayerState.None;
			entity.asPlayer.updateStatsAndAttributes();
			const moveType = Actions.DEBUG_TOOLS.getPlayerData(entity.asPlayer, "noclip") ? MoveType.Flying : MoveType.Land;
			entity.asPlayer.setMoveType(moveType);
		}

		action.setUpdateRender();
		Actions.DEBUG_TOOLS.updateFog();
		gameScreen!.onGameTickEnd();
	});
