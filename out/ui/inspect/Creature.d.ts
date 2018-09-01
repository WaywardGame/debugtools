import { ICreature } from "creature/ICreature";
import { UiApi } from "newui/INewUi";
import { INPC } from "npc/INPC";
import { IPlayer } from "player/IPlayer";
import InspectEntityInformationSubsection from "../component/InspectEntityInformationSubsection";
export default class CreatureInformation extends InspectEntityInformationSubsection {
    private creature;
    constructor(api: UiApi);
    update(entity: ICreature | INPC | IPlayer): void;
    private setTamed;
    private removeCreature;
}
