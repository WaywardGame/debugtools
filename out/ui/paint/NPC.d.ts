import { NPCType } from "entity/npc/NPCS";
import { Events } from "event/EventBuses";
import { IEventEmitter } from "event/EventEmitter";
import Component from "newui/component/Component";
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
