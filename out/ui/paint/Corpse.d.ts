import { CreatureType } from "entity/creature/ICreature";
import Component from "newui/component/Component";
import { IPaintSection } from "../panel/PaintPanel";
export default class CorpsePaint extends Component implements IPaintSection {
    private readonly dropdown;
    private readonly aberrantCheckButton;
    private readonly replaceExisting;
    private corpse;
    constructor();
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
