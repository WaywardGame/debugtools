import IBaseHumanEntity from "entity/IBaseHumanEntity";
import { Stat } from "entity/IStats";
import Component from "newui/component/Component";
import { UiApi } from "newui/INewUi";
import { IInspectEntityInformationSubsection } from "./Entity";
export default class HumanInformation extends Component implements IInspectEntityInformationSubsection {
    private readonly human;
    private readonly dropdownItemQuality;
    private readonly wrapperAddItem;
    private item;
    constructor(api: UiApi, human: IBaseHumanEntity);
    getImmutableStats(): Stat[];
    private addReputationSlider;
    private setReputation;
    private changeItem;
    private addItem;
}
