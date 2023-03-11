import Doodad from "game/doodad/Doodad";
import MagicalPropertyManager from "game/magic/MagicalPropertyManager";
import Tile from "game/tile/Tile";
import CloneContainedItems from "./CloneContainedItems";

/**
 * Clones a doodad to another position.
 */
export default function (doodad: Doodad, tile: Tile) {
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
