import { ICreature } from "creature/ICreature";
import { INPC } from "npc/INPC";
import IPlayer from "player/IPlayer";
import { IVector3 } from "utilities/math/IVector";
export default function (entity: ICreature | INPC | IPlayer, position: IVector3): void;
