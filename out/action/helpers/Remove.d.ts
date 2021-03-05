import Doodad from "game/doodad/Doodad";
import { IActionApi } from "game/entity/action/IAction";
import Corpse from "game/entity/creature/corpse/Corpse";
import Creature from "game/entity/creature/Creature";
import NPC from "game/entity/npc/NPC";
import Player from "game/entity/player/Player";
import Item from "game/item/Item";
import TileEvent from "game/tile/TileEvent";
export default function (action: IActionApi<Player>, target: Creature | NPC | Doodad | Item | Corpse | TileEvent): void;
