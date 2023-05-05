import { TileUpdateType } from "game/IGame";
import Island from "game/island/Island";
import Tile from "game/tile/Tile";

export default function (island: Island, tile: Tile, tilled: boolean) {
	const tileType = tile.type;
	if (!tile.description?.tillable) {
		return;
	}

	const tileData = tile.getOrCreateTileData();
	if (tileData.length === 0) {
		tileData.push({
			type: tileType,
			tilled,
		});

	} else {
		tileData[0].tilled = tilled;
	}

	island.world.updateTile(tile, TileUpdateType.Tilled);
}
