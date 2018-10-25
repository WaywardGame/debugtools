import { IActionApi } from "action/IAction";
import { ICorpse } from "creature/corpse/ICorpse";
import Creature from "creature/Creature";
import { ICreature } from "creature/ICreature";
import Doodad from "doodad/doodads/Doodad";
import { IDoodad } from "doodad/IDoodad";
import { IItem } from "item/IItem";
import Item from "item/Item";
import BaseNPC from "npc/BaseNPC";
import { INPC } from "npc/INPC";
import IPlayer from "player/IPlayer";
import { ITileEvent } from "tile/ITileEvent";
import RemoveItem from "./RemoveItem";

export default function (action: IActionApi<IPlayer>, target: ICreature | INPC | IDoodad | IItem | ICorpse | ITileEvent) {
	if (target instanceof Creature) return creatureManager.remove(target);
	else if (target instanceof BaseNPC) return npcManager.remove(target);
	else if (target instanceof Doodad) return doodadManager.remove(target, true);
	else if (target instanceof Item) return RemoveItem(action, target);
	else if (tileEventManager.is(target)) return tileEventManager.remove(target);
	else if (corpseManager.is(target)) return corpseManager.remove(target);
}
