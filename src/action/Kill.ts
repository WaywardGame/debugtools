import { Action } from "@wayward/game/game/entity/action/Action";
import { ActionArgument } from "@wayward/game/game/entity/action/IAction";
import { DamageType, EntityType } from "@wayward/game/game/entity/IEntity";
import { defaultCanUseHandler, defaultUsability } from "../Actions";
import { DebugToolsTranslation, translation } from "../IDebugTools";

/**
 * Kills an entity by dealing `Infinity` true damage to it.
 */
export default new Action(ActionArgument.Entity)
	.setUsableBy(EntityType.Human)
	.setUsableWhen(...defaultUsability)
	.setCanUse(defaultCanUseHandler)
	.setHandler((action, entity) => {
		if (!entity?.asHuman?.isGhost || entity?.isCreature()) {
			(entity?.asHuman ?? entity?.asCreature)?.damage({
				type: DamageType.True,
				amount: Infinity,
				damageMessage: translation(DebugToolsTranslation.KillEntityDeathMessage),
			});

			renderers.computeSpritesInViewport(entity);
			action.setUpdateRender();
			action.setPassTurn();
		}
	});
