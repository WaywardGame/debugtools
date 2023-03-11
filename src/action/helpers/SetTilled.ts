import { TileUpdateType } from "game/IGame";
import Island from "game/island/Island";
import terrainDescriptions from "game/tile/Terrains";
import Tile from "game/tile/Tile";

export default function (island: Island, tile: Tile, tilled: boolean) {
	const tileType = tile.type;
	if (!terrainDescriptions[tileType]!.tillable) {
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
