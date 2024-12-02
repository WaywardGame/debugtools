import { Action } from "@wayward/game/game/entity/action/Action";
import Ride from "@wayward/game/game/entity/action/actions/Ride";
import SailToCivilization from "@wayward/game/game/entity/action/actions/SailToCivilization";
import { EntityType } from "@wayward/game/game/entity/IEntity";
import { ItemType } from "@wayward/game/game/item/IItem";
import { TerrainType } from "@wayward/game/game/tile/ITerrain";
import { defaultCanUseHandler } from "../Actions";
import { ActionUsability } from "@wayward/game/game/entity/action/IAction";

export default new Action()
	.setUsableBy(EntityType.Player)
	.setUsableWhen(ActionUsability.Always)
	.setCanUse(defaultCanUseHandler)
	.setHandler(action => {
		const position = action.executor.tile.findMatchingTile(tile => tile.type === TerrainType.DeepSeawater);
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
			action.executor.createItemInInventory(ItemType.GoldShortSword);
			action.executor.createItemInInventory(ItemType.GoldenSextant);
		}

		if (action.executor.isLocalPlayer) {
			void Ride.execute(action.executor, sailboat);
			void SailToCivilization.execute(action, sailboat, true);
		}
	});
