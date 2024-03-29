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

import Doodad from "game/doodad/Doodad";
import { IActionApi } from "game/entity/action/IAction";
import Corpse from "game/entity/creature/corpse/Corpse";
import Creature from "game/entity/creature/Creature";
import NPC from "game/entity/npc/NPC";
import Item from "game/item/Item";
import TileEvent from "game/tile/TileEvent";
import RemoveItem from "./RemoveItem";
import Human from "game/entity/Human";


export default function (action: IActionApi<Human>, target: Creature | NPC | Doodad | Item | Corpse | TileEvent) {
	if (target instanceof Creature) return action.executor.island.creatures.remove(target);
	if (target instanceof NPC) return action.executor.island.npcs.remove(target);
	if (target instanceof Doodad) return action.executor.island.doodads.remove(target, true);
	if (target instanceof Item) return RemoveItem(action, target);
	if (target instanceof TileEvent) return action.executor.island.tileEvents.remove(target);
	if (target instanceof Corpse) return action.executor.island.corpses.remove(target);
}
