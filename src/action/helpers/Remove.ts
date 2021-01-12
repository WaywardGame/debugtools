import Doodad from "doodad/Doodad";
import { IActionApi } from "entity/action/IAction";
import Corpse from "entity/creature/corpse/Corpse";
import Creature from "entity/creature/Creature";
import NPC from "entity/npc/NPC";
import Player from "entity/player/Player";
import Item from "item/Item";
import TileEvent from "tile/TileEvent";

import RemoveItem from "./RemoveItem";

export default function (action: IActionApi<Player>, target: Creature | NPC | Doodad | Item | Corpse | TileEvent) {
	if (target instanceof Creature) return creatureManager.remove(target);
	if (target instanceof NPC) return npcManager.remove(target);
	if (target instanceof Doodad) return doodadManager.remove(target, true);
	if (target instanceof Item) return RemoveItem(action, target);
	if (tileEventManager.is(target)) return tileEventManager.remove(target);
	if (corpseManager.is(target)) return corpseManager.remove(target);
}
