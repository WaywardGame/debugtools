import { ICorpse } from "entity/creature/corpse/ICorpse";
import Player from "entity/player/Player";
import Vector3 from "utilities/math/Vector3";

import { DebugToolsTranslation, translation } from "../../IDebugTools";

import GetPosition from "./GetPosition";

export default function (player: Player, corpse: ICorpse) {
	// fail if the location is blocked
	const location = GetPosition(player, new Vector3(corpse), () => translation(DebugToolsTranslation.ActionResurrect)
		.get(corpseManager.getName(corpse)));

	if (!location) return false;

	const creature = creatureManager.spawn(corpse.type, corpse.x, corpse.y, corpse.z, true, corpse.aberrant);
	creature!.renamed = corpse.renamed;
	corpseManager.remove(corpse);

	renderer.computeSpritesInViewport();
	return true;
}
