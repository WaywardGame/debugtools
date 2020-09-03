import { Action } from "entity/action/Action";
import { EntityType } from "entity/IEntity";
import { defaultUsability } from "../Actions";
import ActionExecutor from "entity/action/ActionExecutor";
import { ActionType } from "entity/action/IAction";
import { ItemType } from "item/IItem";
import TileHelpers from "utilities/TileHelpers";
import { TerrainType } from "tile/ITerrain";

export default new Action()
	.setUsableBy(EntityType.Player)
	.setUsableWhen(...defaultUsability)
	.setHandler((action) => {
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
			ActionExecutor.get(ActionType.Paddle).execute(action.executor, sailboat);
			ActionExecutor.get(ActionType.SailToCivilization).execute(action.executor, sailboat, true);
		}
	});
