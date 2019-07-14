import { ICreature } from "entity/creature/ICreature";
import { INPC } from "entity/npc/INPC";
import Player from "entity/player/Player";
import { IVector3 } from "utilities/math/IVector";
export default function (entity: ICreature | INPC | Player, position: IVector3): void;
