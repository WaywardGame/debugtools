import { CreatureType } from "Enums";
import Component from "newui/component/Component";
import { UiApi } from "newui/INewUi";
import { IPaintSection } from "../DebugToolsDialog";
export default class CreaturePaint extends Component implements IPaintSection {
    private readonly aberrantCheckButton;
    private creature;
    constructor(api: UiApi);
    getTilePaintData(): {
        creature: {
            type: CreatureType | "remove";
            aberrant: boolean;
        };
    } | undefined;
    private changeCreature;
}
