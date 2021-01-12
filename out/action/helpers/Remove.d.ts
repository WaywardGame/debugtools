import Doodad from "doodad/Doodad";
import { IActionApi } from "entity/action/IAction";
import Corpse from "entity/creature/corpse/Corpse";
import Creature from "entity/creature/Creature";
import NPC from "entity/npc/NPC";
import Player from "entity/player/Player";
import Item from "item/Item";
import TileEvent from "tile/TileEvent";
export default function (action: IActionApi<Player>, target: Creature | NPC | Doodad | Item | Corpse | TileEvent): void;
