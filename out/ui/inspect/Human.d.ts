import Creature from "entity/creature/Creature";
import { Stat } from "entity/IStats";
import NPC from "entity/npc/NPC";
import Player from "entity/player/Player";
import InspectEntityInformationSubsection from "../component/InspectEntityInformationSubsection";
export default class HumanInformation extends InspectEntityInformationSubsection {
    private readonly addItemContainer;
    private readonly reputationSliders;
    private human;
    constructor();
    protected onSwitchTo(): void;
    getImmutableStats(): Stat[];
    update(entity: Creature | NPC | Player): void;
    private addReputationSlider;
    private setReputation;
    private addItem;
    private onStatChange;
}
