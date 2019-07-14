import { ICreature } from "entity/creature/ICreature";
import { INPC } from "entity/npc/INPC";
import Player from "entity/player/Player";
import InspectEntityInformationSubsection from "../component/InspectEntityInformationSubsection";
export default class NpcInformation extends InspectEntityInformationSubsection {
    private npc;
    constructor();
    update(entity: ICreature | Player | INPC): void;
    private removeNPC;
}
