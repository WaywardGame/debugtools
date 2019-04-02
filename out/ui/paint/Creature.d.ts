import { CreatureType } from "entity/creature/ICreature";
import { ExtendedEvents } from "event/EventEmitter";
import Component from "newui/component/Component";
import { IPaintSection, IPaintSectionEvents } from "../panel/PaintPanel";
export default class CreaturePaint extends Component implements IPaintSection {
    event: ExtendedEvents<this, Component, IPaintSectionEvents>;
    private dropdown;
    private readonly aberrantCheckButton;
    private creature;
    constructor();
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
