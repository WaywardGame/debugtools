import { CreatureType } from "entity/creature/ICreature";
import Component from "newui/component/Component";
import { IPaintSection } from "../panel/PaintPanel";
export default class CreaturePaint extends Component implements IPaintSection {
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
