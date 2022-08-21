import Corpse from "game/entity/creature/corpse/Corpse";
import Human from "game/entity/Human";
import Vector3 from "utilities/math/Vector3";
import { DebugToolsTranslation, translation } from "../../IDebugTools";
import GetPosition from "./GetPosition";


export default function (human: Human, corpse: Corpse) {
	// fail if the location is blocked
	const location = GetPosition(human, new Vector3(corpse), () => translation(DebugToolsTranslation.ActionResurrect)
		.get(human.island.corpses.getName(corpse)));

	if (!location) return false;

	const creature = human.island.creatures.spawn(corpse.type, corpse.x, corpse.y, corpse.z, true, corpse.aberrant, undefined, true);
	creature!.renamed = corpse.renamed;
	human.island.corpses.remove(corpse);

	renderers.computeSpritesInViewport();
	return true;
}
