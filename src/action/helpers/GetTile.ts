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

import Human from "game/entity/Human";
import { MoveType } from "game/entity/IEntity";
import { MessageType } from "game/entity/player/IMessageManager";
import Tile from "game/tile/Tile";
import { TranslationGenerator } from "ui/component/IComponent";
import Text from "ui/component/Text";
import Actions from "../../Actions";

/**
 * Given a position, finds an open tile, or sends an error message to executing player.
 * @param human The executing human of an action.
 * @param tile The position to start looking for an open tile.
 * @param actionName The name of the action the player is attempting to execute. This is printed in the error message.
 */
export function getTile(human: Human, tile: Tile, actionName: TranslationGenerator): Tile | undefined {
	if (tile.isOpenTile || human.getMoveType() === MoveType.Flying) {
		return tile;
	}

	const openTile = tile?.findMatchingTile((tile) => !tile.isTileBlocked);
	if (!openTile) {
		human.messages.source(Actions.DEBUG_TOOLS.source)
			.type(MessageType.Bad)
			.send(Actions.DEBUG_TOOLS.messageFailureTileBlocked, Text.resolve(actionName));
	}

	return openTile;
}
