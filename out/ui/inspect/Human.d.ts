import Entity from "game/entity/Entity";
import { Stat } from "game/entity/IStats";
import InspectEntityInformationSubsection from "../component/InspectEntityInformationSubsection";
export default class HumanInformation extends InspectEntityInformationSubsection {
    private readonly addItemContainer;
    private readonly reputationSliders;
    private human;
    constructor();
    protected onSwitchTo(): void;
    getImmutableStats(): Stat[];
    update(entity: Entity): void;
    private addReputationSlider;
    private setReputation;
    private addItem;
    private onStatChange;
}
