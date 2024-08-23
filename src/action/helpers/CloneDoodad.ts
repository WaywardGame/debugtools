/*!
 * Copyright 2011-2024 Unlok
 * https://www.unlok.ca
 *
 * Credits & Thanks:
 * https://www.unlok.ca/credits-thanks/
 *
 * Wayward is a copyrighted and licensed work. Modification and/or distribution of any source files is prohibited. If you wish to modify the game in any way, please refer to the modding guide:
 * https://github.com/WaywardGame/types/wiki
 */

import Doodad from "@wayward/game/game/doodad/Doodad";
import MagicalPropertyManager from "@wayward/game/game/magic/MagicalPropertyManager";
import Tile from "@wayward/game/game/tile/Tile";
import CloneContainedItems from "./CloneContainedItems";

/**
 * Clones a doodad to another position.
 */
export default function (doodad: Doodad, tile: Tile): void {
	const clone = doodad.island.doodads.create(doodad.type, tile, {
		quality: doodad.quality,
		stillContainer: doodad.stillContainer,
		gatherReady: doodad.gatherReady,
		growth: doodad.growth,
		spread: doodad.spread,
		weight: doodad.weight,
		disassembly: !doodad.disassembly ? undefined : doodad.disassembly
			.map(item => doodad.island.items.createFake(item.type, item.quality)),
		builderIdentifier: doodad.builderIdentifier,
		crafterIdentifier: doodad.crafterIdentifier,
		step: doodad.step,
	});

	if (!clone) return;

	MagicalPropertyManager.inherit(doodad, clone);

	if (doodad.containedItems) {
		CloneContainedItems(doodad.island, doodad, clone);
	}
}
