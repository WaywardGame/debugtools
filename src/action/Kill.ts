import { Action } from "entity/action/Action";
import { ActionArgument } from "entity/action/IAction";
import { DamageType, EntityType } from "entity/IEntity";
import { defaultUsability } from "../Actions";
import { DebugToolsTranslation, translation } from "../IDebugTools";

/**
 * Kills an entity by dealing `Infinity` true damage to it.
 */
export default new Action(ActionArgument.Entity)
	.setUsableBy(EntityType.Player)
	.setUsableWhen(...defaultUsability)
	.setHandler((action, entity) => {
		entity.damage({
			type: DamageType.True,
			amount: Infinity,
			damageMessage: translation(DebugToolsTranslation.KillEntityDeathMessage),
		});

		renderer.computeSpritesInViewport();
		action.setUpdateRender();

		if (!multiplayer.isConnected() && entity.asPlayer?.isLocalPlayer()) {
			action.setPassTurn();
		}
	});
