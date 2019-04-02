import { CreatureType } from "entity/creature/ICreature";
import { ExtendedEvents } from "event/EventEmitter";
import Component from "newui/component/Component";
import { IPaintSection, IPaintSectionEvents } from "../panel/PaintPanel";
export default class CorpsePaint extends Component implements IPaintSection {
    event: ExtendedEvents<this, Component, IPaintSectionEvents>;
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
