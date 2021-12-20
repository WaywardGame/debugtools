import Corpse from "game/entity/creature/corpse/Corpse";
import Player from "game/entity/player/Player";
import Vector3 from "utilities/math/Vector3";
import { DebugToolsTranslation, translation } from "../../IDebugTools";
import GetPosition from "./GetPosition";



export default function (player: Player, corpse: Corpse) {
	// fail if the location is blocked
	const location = GetPosition(player, new Vector3(corpse), () => translation(DebugToolsTranslation.ActionResurrect)
		.get(player.island.corpses.getName(corpse)));

	if (!location) return false;

	const creature = player.island.creatures.spawn(corpse.type, corpse.x, corpse.y, corpse.z, true, corpse.aberrant, undefined, true);
	creature!.renamed = corpse.renamed;
	player.island.corpses.remove(corpse);

	renderer?.computeSpritesInViewport();
	return true;
}
