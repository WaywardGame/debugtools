import { TileUpdateType } from "@wayward/game/game/IGame";
import type Island from "@wayward/game/game/island/Island";
import type Tile from "@wayward/game/game/tile/Tile";

export default function (island: Island, tile: Tile, tilled: boolean): void {
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

	tile.updateWorldTile(TileUpdateType.Tilled);
}
