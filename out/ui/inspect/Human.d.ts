import { ICreature } from "entity/creature/ICreature";
import { Stat } from "entity/IStats";
import { INPC } from "entity/npc/INPC";
import Player from "entity/player/Player";
import InspectEntityInformationSubsection from "../component/InspectEntityInformationSubsection";
export default class HumanInformation extends InspectEntityInformationSubsection {
    private readonly addItemContainer;
    private readonly reputationSliders;
    private human;
    constructor();
    protected onSwitchTo(): void;
    getImmutableStats(): Stat[];
    update(entity: ICreature | INPC | Player): void;
    private addReputationSlider;
    private setReputation;
    private addItem;
    private onStatChange;
}
