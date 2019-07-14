import { MoveType } from "entity/IEntity";
import { MessageType } from "entity/player/MessageManager";
import Player from "entity/player/Player";
import { TranslationGenerator } from "newui/component/IComponent";
import Text from "newui/component/Text";
import { IVector3 } from "utilities/math/IVector";
import TileHelpers from "utilities/TileHelpers";

import Actions from "../../Actions";

/**
 * Given a position, finds an open tile, or sends an error message to executing player.
 * @param player The executing player of an action.
 * @param position The position to start looking for an open tile.
 * @param actionName The name of the action the player is attempting to execute. This is printed in the error message.
 */
export default function (player: Player, position: IVector3, actionName: TranslationGenerator) {
	if (TileHelpers.isOpenTile(position, game.getTile(position.x, position.y, position.z)) ||
		player.getMoveType() === MoveType.Flying) {
		return position;
	}

	const openTile = TileHelpers.findMatchingTile(position, TileHelpers.isOpenTile);

	if (!openTile) {
		player.messages.source(Actions.DEBUG_TOOLS.source)
			.type(MessageType.Bad)
			.send(Actions.DEBUG_TOOLS.messageFailureTileBlocked, Text.resolve(actionName));
	}

	return openTile;
}
