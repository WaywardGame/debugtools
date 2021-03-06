import Doodad from "game/doodad/Doodad";
import { IVector3 } from "utilities/math/IVector";
import CloneContainedItems from "./CloneContainedItems";


/**
 * Clones a doodad to another position.
 */
export default function (doodad: Doodad, position: IVector3) {
	const clone = doodadManager.create(doodad.type, position.x, position.y, position.z, {
		stillContainer: doodad.stillContainer,
		gatherReady: doodad.gatherReady,
		gfx: doodad.gfx,
		spread: doodad.spread,
		weight: doodad.weight,
		disassembly: !doodad.disassembly ? undefined : doodad.disassembly
			.map(item => itemManager.createFake(item.type, item.quality)),
		ownerIdentifier: doodad.ownerIdentifier,
		step: doodad.step,
	});

	if (!clone) return;

	clone.magic.inherit(doodad.magic);

	if (doodad.containedItems) {
		CloneContainedItems(doodad, clone);
	}
}
