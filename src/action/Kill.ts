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

import { Action } from "game/entity/action/Action";
import { ActionArgument } from "game/entity/action/IAction";
import { DamageType, EntityType } from "game/entity/IEntity";
import { defaultUsability } from "../Actions";
import { DebugToolsTranslation, translation } from "../IDebugTools";

/**
 * Kills an entity by dealing `Infinity` true damage to it.
 */
export default new Action(ActionArgument.Entity)
	.setUsableBy(EntityType.Human)
	.setUsableWhen(...defaultUsability)
	.setHandler((action, entity) => {
		(entity?.asHuman ?? entity?.asCreature)?.damage({
			type: DamageType.True,
			amount: Infinity,
			damageMessage: translation(DebugToolsTranslation.KillEntityDeathMessage),
		});

		renderers.computeSpritesInViewport(entity);
		action.setUpdateRender();

		if (!multiplayer.isConnected() && entity.asPlayer?.isLocalPlayer()) {
			action.setPassTurn();
		}
	});
