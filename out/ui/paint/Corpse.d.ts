import { CreatureType } from "Enums";
import Component from "newui/component/Component";
import { UiApi } from "newui/INewUi";
import { IPaintSection } from "../panel/PaintPanel";
export default class CorpsePaint extends Component implements IPaintSection {
    private readonly dropdown;
    private readonly aberrantCheckButton;
    private readonly replaceExisting;
    private corpse;
    constructor(api: UiApi);
    getTilePaintData(): {
        corpse: {
            type: CreatureType | "remove" | undefined;
            aberrant: boolean;
            replaceExisting: boolean;
        };
    };
    isChanging(): boolean;
    reset(): void;
    private changeCorpse;
}
