import { IDoodad } from "doodad/IDoodad";
import { IActionApi } from "entity/action/IAction";
import { ICorpse } from "entity/creature/corpse/ICorpse";
import { ICreature } from "entity/creature/ICreature";
import { INPC } from "entity/npc/INPC";
import Player from "entity/player/Player";
import { IItem } from "item/IItem";
import { ITileEvent } from "tile/ITileEvent";
export default function (action: IActionApi<Player>, target: ICreature | INPC | IDoodad | IItem | ICorpse | ITileEvent): void;
