import Corpse from "game/entity/creature/corpse/Corpse";
import Human from "game/entity/Human";
import { DebugToolsTranslation, translation } from "../../IDebugTools";
import { getTile } from "./GetTile";

export default function (human: Human, corpse: Corpse) {
	// fail if the location is blocked
	const tile = getTile(human, corpse.tile, () => translation(DebugToolsTranslation.ActionResurrect)
		.get(human.island.corpses.getName(corpse)));

	if (!tile) return false;

	const creature = human.island.creatures.spawn(corpse.type, tile, true, corpse.aberrant, undefined, true);
	creature!.renamed = corpse.renamed;
	human.island.corpses.remove(corpse);

	renderers.computeSpritesInViewport(corpse);
	return true;
}
