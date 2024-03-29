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
import { EntityType, MoveType } from "game/entity/IEntity";
import { RenderSource } from "renderer/IRenderer";
import { defaultUsability } from "../Actions";

export default new Action(ActionArgument.Player)
	.setUsableBy(EntityType.Human)
	.setUsableWhen(...defaultUsability)
	.setHandler((action, player) => {
		if (!player) return;

		player.setMoveType(player.isFlying ? MoveType.Land : MoveType.Flying);

		player.updateView(RenderSource.Mod, true);
	});
