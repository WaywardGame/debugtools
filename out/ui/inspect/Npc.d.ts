import { ICreature } from "creature/ICreature";
import IGameScreenApi from "newui/screen/screens/game/IGameScreenApi";
import { INPC } from "npc/INPC";
import { IPlayer } from "player/IPlayer";
import InspectEntityInformationSubsection from "../component/InspectEntityInformationSubsection";
export default class NpcInformation extends InspectEntityInformationSubsection {
    private npc;
    constructor(gsapi: IGameScreenApi);
    update(entity: ICreature | IPlayer | INPC): void;
    private removeNPC;
}
