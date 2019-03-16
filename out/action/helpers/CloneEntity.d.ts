import { ICreature } from "entity/creature/ICreature";
import { INPC } from "entity/npc/INPC";
import IPlayer from "entity/player/IPlayer";
import { IVector3 } from "utilities/math/IVector";
export default function (entity: ICreature | INPC | IPlayer, position: IVector3): void;
