import { TileUpdateType } from "game/IGame";
import Island from "game/island/Island";
import terrainDescriptions from "game/tile/Terrains";
import TileHelpers from "utilities/game/TileHelpers";

export default function (island: Island, x: number, y: number, z: number, tilled: boolean) {
	const tile = island.getTile(x, y, z);

	const tileType = TileHelpers.getType(tile);
	if (!terrainDescriptions[tileType]!.tillable) {
		return;
	}

	const tileData = island.getOrCreateTileData(x, y, z);
	if (tileData.length === 0) {
		tileData.push({
			type: tileType,
			tilled,
		});

	} else {
		tileData[0].tilled = tilled;
	}

	TileHelpers.setTilled(tile, tilled);

	island.world.updateTile(x, y, z, tile, TileUpdateType.Tilled);
}
