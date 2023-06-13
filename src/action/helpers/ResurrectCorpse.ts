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
