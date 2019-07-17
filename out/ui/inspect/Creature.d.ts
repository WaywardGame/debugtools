import Creature from "entity/creature/Creature";
import NPC from "entity/npc/NPC";
import Player from "entity/player/Player";
import InspectEntityInformationSubsection from "../component/InspectEntityInformationSubsection";
export default class CreatureInformation extends InspectEntityInformationSubsection {
    private creature;
    constructor();
    update(entity: Creature | NPC | Player): void;
    private setTamed;
    private removeCreature;
}
