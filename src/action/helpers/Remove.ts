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
import { IActionApi } from "@wayward/game/game/entity/action/IAction";
import Corpse from "@wayward/game/game/entity/creature/corpse/Corpse";
import Creature from "@wayward/game/game/entity/creature/Creature";
import NPC from "@wayward/game/game/entity/npc/NPC";
import Item from "@wayward/game/game/item/Item";
import TileEvent from "@wayward/game/game/tile/TileEvent";
import RemoveItem from "./RemoveItem";
import Human from "@wayward/game/game/entity/Human";


export default function (action: IActionApi<Human>, target: Creature | NPC | Doodad | Item | Corpse | TileEvent): void {
	if (target instanceof Creature) return action.executor.island.creatures.remove(target);
	if (target instanceof NPC) return action.executor.island.npcs.remove(target);
	if (target instanceof Doodad) return action.executor.island.doodads.remove(target);
	if (target instanceof Item) return RemoveItem(action, target);
	if (target instanceof TileEvent) return action.executor.island.tileEvents.remove(target);
	if (target instanceof Corpse) return action.executor.island.corpses.remove(target);
}
