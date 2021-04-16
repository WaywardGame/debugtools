import { Events, IEventEmitter } from "event/EventEmitter";
import { NPCType } from "game/entity/npc/INPCs";
import Component from "ui/component/Component";
import { IPaintSection } from "../panel/PaintPanel";
export default class NPCPaint extends Component implements IPaintSection {
    event: IEventEmitter<this, Events<IPaintSection>>;
    private readonly dropdown;
    private npc;
    constructor();
    getTilePaintData(): {
        npc: {
            type: NPCType | "remove";
        };
    } | undefined;
    isChanging(): boolean;
    reset(): void;
    private changeNPC;
}
