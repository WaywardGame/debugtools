import { Events, IEventEmitter } from "event/EventEmitter";
import { CreatureType } from "game/entity/creature/ICreature";
import Component from "ui/component/Component";
import { IPaintSection } from "../panel/PaintPanel";
export default class CreaturePaint extends Component implements IPaintSection {
    event: IEventEmitter<this, Events<IPaintSection>>;
    private readonly dropdown;
    private readonly aberrantCheckButton;
    private creature;
    constructor();
    getTilePaintData(): {
        creature: {
            type: "remove" | CreatureType;
            aberrant: boolean;
        };
    } | undefined;
    isChanging(): boolean;
    reset(): void;
    private changeCreature;
}
