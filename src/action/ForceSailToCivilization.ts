import { Action } from "game/entity/action/Action";
import Paddle from "game/entity/action/actions/Paddle";
import SailToCivilization from "game/entity/action/actions/SailToCivilization";
import { EntityType } from "game/entity/IEntity";
import { ItemType } from "game/item/IItem";
import { TerrainType } from "game/tile/ITerrain";
import TileHelpers from "utilities/game/TileHelpers";
import { defaultUsability } from "../Actions";

export default new Action()
	.setUsableBy(EntityType.Player)
	.setUsableWhen(...defaultUsability)
	.setHandler(action => {
		const position = TileHelpers.findMatchingTile(action.executor, (_, tile) => TileHelpers.getType(tile) === TerrainType.DeepSeawater);
		if (!position) {
			return;
		}

		action.executor.setPosition(position);

		const sailboat = action.executor.createItemInInventory(ItemType.Sailboat);

		if (game.isChallenge) {
			action.executor.quests.reset();

		} else {
			action.executor.createItemInInventory(ItemType.GoldCoins);
			action.executor.createItemInInventory(ItemType.GoldenChalice);
			action.executor.createItemInInventory(ItemType.GoldenKey);
			action.executor.createItemInInventory(ItemType.GoldenRing);
			action.executor.createItemInInventory(ItemType.GoldSword);
			action.executor.createItemInInventory(ItemType.GoldenSextant);
		}

		if (action.executor.isLocalPlayer()) {
			Paddle.execute(action.executor, sailboat);
			SailToCivilization.execute(action, sailboat, true);
		}
	});
