import { IActionApi } from "action/IAction";
import { ICorpse } from "creature/corpse/ICorpse";
import { ICreature } from "creature/ICreature";
import { IDoodad } from "doodad/IDoodad";
import { IItem } from "item/IItem";
import { INPC } from "npc/INPC";
import IPlayer from "player/IPlayer";
import { ITileEvent } from "tile/ITileEvent";
export default function (action: IActionApi<IPlayer>, target: ICreature | INPC | IDoodad | IItem | ICorpse | ITileEvent): void;
