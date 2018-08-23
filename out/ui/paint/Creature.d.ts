import { CreatureType } from "Enums";
import Component from "newui/component/Component";
import { UiApi } from "newui/INewUi";
import { IPaintSection } from "../panel/PaintPanel";
export default class CreaturePaint extends Component implements IPaintSection {
    private dropdown;
    private readonly aberrantCheckButton;
    private creature;
    constructor(api: UiApi);
    getTilePaintData(): {
        creature: {
            type: CreatureType | "remove";
            aberrant: boolean;
        };
    } | undefined;
    isChanging(): boolean;
    reset(): void;
    private changeCreature;
}
