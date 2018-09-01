import { ICreature } from "creature/ICreature";
import { UiApi } from "newui/INewUi";
import { INPC } from "npc/INPC";
import { IPlayer } from "player/IPlayer";
import InspectEntityInformationSubsection from "../component/InspectEntityInformationSubsection";
export default class NpcInformation extends InspectEntityInformationSubsection {
    private npc;
    constructor(api: UiApi);
    update(entity: ICreature | IPlayer | INPC): void;
    private removeNPC;
}
