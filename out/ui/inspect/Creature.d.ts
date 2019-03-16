import { ICreature } from "entity/creature/ICreature";
import { INPC } from "entity/npc/INPC";
import { IPlayer } from "entity/player/IPlayer";
import InspectEntityInformationSubsection from "../component/InspectEntityInformationSubsection";
export default class CreatureInformation extends InspectEntityInformationSubsection {
    private creature;
    constructor();
    update(entity: ICreature | INPC | IPlayer): void;
    private setTamed;
    private removeCreature;
}
