import { Action } from "action/Action";
import { ActionArgument, anyOf } from "action/IAction";
import { ICorpse } from "creature/corpse/ICorpse";
import BaseEntity from "entity/BaseEntity";
import { StatusEffectChangeReason } from "entity/IBaseEntity";
import { Entity, EntityType } from "entity/IEntity";
import { IStatMax, Stat } from "entity/IStats";
import { PlayerState, StatusType } from "Enums";
import { ScreenId } from "newui/screen/IScreen";
import GameScreen from "newui/screen/screens/GameScreen";
import Actions, { defaultUsability } from "../Actions";
import ResurrectCorpse from "./helpers/ResurrectCorpse";

/**
 * The core stats, namely, Health, Stamina, Hunger, and Thirst, are all set to their maximum values. Any status effects are removed.
 */
export default new Action(anyOf(ActionArgument.Entity, ActionArgument.Corpse))
	.setUsableBy(EntityType.Player)
	.setUsableWhen(...defaultUsability)
	.setHandler((action, entityOrCorpse) => {

		// resurrect corpses
		if (!(entityOrCorpse instanceof BaseEntity)) {
			if (ResurrectCorpse(action.executor, entityOrCorpse as ICorpse)) {
				action.setUpdateRender();
			}

			return;
		}

		const entity = entityOrCorpse as Entity;

		const health = entity.getStat<IStatMax>(Stat.Health);
		const stamina = entity.getStat<IStatMax>(Stat.Stamina);
		const hunger = entity.getStat<IStatMax>(Stat.Hunger);
		const thirst = entity.getStat<IStatMax>(Stat.Thirst);

		entity.setStat(health, entity.entityType === EntityType.Player ? entity.getMaxHealth() : health.max);
		if (stamina) entity.setStat(stamina, stamina.max);
		if (hunger) entity.setStat(hunger, hunger.max);
		if (thirst) entity.setStat(thirst, thirst.max);

		entity.setStatus(StatusType.Bleeding, false, StatusEffectChangeReason.Passed);
		entity.setStatus(StatusType.Burned, false, StatusEffectChangeReason.Passed);
		entity.setStatus(StatusType.Poisoned, false, StatusEffectChangeReason.Passed);

		if (entity.entityType === EntityType.Player) {
			entity.state = PlayerState.None;
			entity.updateStatsAndAttributes();
		}

		action.setUpdateRender();
		Actions.DEBUG_TOOLS.updateFog();
		newui.getScreen<GameScreen>(ScreenId.Game)!.onGameTickEnd();
	});
