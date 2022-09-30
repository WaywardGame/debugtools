import Doodad from "game/doodad/Doodad";
import { IVector3 } from "utilities/math/IVector";
import CloneContainedItems from "./CloneContainedItems";


/**
 * Clones a doodad to another position.
 */
export default function (doodad: Doodad, position: IVector3) {
	const clone = doodad.island.doodads.create(doodad.type, position.x, position.y, position.z, {
		quality: doodad.quality,
		stillContainer: doodad.stillContainer,
		gatherReady: doodad.gatherReady,
		gfx: doodad.gfx,
		spread: doodad.spread,
		weight: doodad.weight,
		disassembly: !doodad.disassembly ? undefined : doodad.disassembly
			.map(item => doodad.island.items.createFake(item.type, item.quality)),
		builderIdentifier: doodad.builderIdentifier,
		crafterIdentifier: doodad.crafterIdentifier,
		step: doodad.step,
	});

	if (!clone) return;

	clone.magic.inherit(doodad.magic);

	if (doodad.containedItems) {
		CloneContainedItems(doodad.island, doodad, clone);
	}
}
