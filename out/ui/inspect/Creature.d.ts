import { ICreature } from "creature/ICreature";
import Component from "newui/component/Component";
import { UiApi } from "newui/INewUi";
import { IInspectEntityInformationSubsection } from "./Entity";
export default class CreatureInformation extends Component implements IInspectEntityInformationSubsection {
    private readonly creature;
    constructor(api: UiApi, creature: ICreature);
    getImmutableStats(): never[];
    private setTamed;
    private removeCreature;
}
