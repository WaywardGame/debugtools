import { ICreature } from "entity/creature/ICreature";
import { INPC } from "entity/npc/INPC";
import Player from "entity/player/Player";
import InspectEntityInformationSubsection from "../component/InspectEntityInformationSubsection";
export default class CreatureInformation extends InspectEntityInformationSubsection {
    private creature;
    constructor();
    update(entity: ICreature | INPC | Player): void;
    private setTamed;
    private removeCreature;
}
