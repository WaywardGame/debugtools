import Doodad from "game/doodad/Doodad";
import { IActionApi } from "game/entity/action/IAction";
import Corpse from "game/entity/creature/corpse/Corpse";
import Creature from "game/entity/creature/Creature";
import NPC from "game/entity/npc/NPC";
import Player from "game/entity/player/Player";
import Item from "game/item/Item";
import TileEvent from "game/tile/TileEvent";
import RemoveItem from "./RemoveItem";


export default function (action: IActionApi<Player>, target: Creature | NPC | Doodad | Item | Corpse | TileEvent) {
	if (target instanceof Creature) return creatureManager.remove(target);
	if (target instanceof NPC) return npcManager.remove(target);
	if (target instanceof Doodad) return doodadManager.remove(target, true);
	if (target instanceof Item) return RemoveItem(action, target);
	if (target instanceof TileEvent) return tileEventManager.remove(target);
	if (target instanceof Corpse) return corpseManager.remove(target);
}
