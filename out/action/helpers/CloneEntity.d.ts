import Creature from "entity/creature/Creature";
import NPC from "entity/npc/NPC";
import Player from "entity/player/Player";
import { IVector3 } from "utilities/math/IVector";
export default function (entity: Creature | NPC | Player, position: IVector3): void;
