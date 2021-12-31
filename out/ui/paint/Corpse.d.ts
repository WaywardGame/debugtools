import { Events, IEventEmitter } from "event/EventEmitter";
import { CreatureType } from "game/entity/creature/ICreature";
import Component from "ui/component/Component";
import { IPaintSection } from "../panel/PaintPanel";
export default class CorpsePaint extends Component implements IPaintSection {
    event: IEventEmitter<this, Events<IPaintSection>>;
    private readonly dropdown;
    private readonly aberrantCheckButton;
    private readonly replaceExisting;
    private corpse;
    constructor();
    getTilePaintData(): {
        corpse: {
            type: "remove" | CreatureType | undefined;
            aberrant: boolean;
            replaceExisting: boolean;
        };
    };
    isChanging(): boolean;
    reset(): void;
    private changeCorpse;
}
