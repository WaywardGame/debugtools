import Human from "game/entity/Human";
import { MoveType } from "game/entity/IEntity";
import { MessageType } from "game/entity/player/IMessageManager";
import Tile from "game/tile/Tile";
import { TranslationGenerator } from "ui/component/IComponent";
import Text from "ui/component/Text";
import { IVector3 } from "utilities/math/IVector";
import Actions from "../../Actions";

/**
 * Given a position, finds an open tile, or sends an error message to executing player.
 * @param human The executing human of an action.
 * @param position The position to start looking for an open tile.
 * @param actionName The name of the action the player is attempting to execute. This is printed in the error message.
 */
export default function (human: Human, position: IVector3, actionName: TranslationGenerator): Tile | undefined {
	const tile = human.island.getTileSafe(position.x, position.y, position.z);
	if (tile && (tile.isOpenTile || human.getMoveType() === MoveType.Flying)) {
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
