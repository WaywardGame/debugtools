import { ICreature } from "entity/creature/ICreature";
import { INPC } from "entity/npc/INPC";
import { IPlayer } from "entity/player/IPlayer";
import InspectEntityInformationSubsection from "../component/InspectEntityInformationSubsection";
export default class NpcInformation extends InspectEntityInformationSubsection {
    private npc;
    constructor();
    update(entity: ICreature | IPlayer | INPC): void;
    private removeNPC;
}
