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

import { TileUpdateType } from "@wayward/game/game/IGame";
import Island from "@wayward/game/game/island/Island";
import Tile from "@wayward/game/game/tile/Tile";

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
