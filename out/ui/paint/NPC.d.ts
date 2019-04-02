import { NPCType } from "entity/npc/NPCS";
import { ExtendedEvents } from "event/EventEmitter";
import Component from "newui/component/Component";
import { IPaintSection, IPaintSectionEvents } from "../panel/PaintPanel";
export default class NPCPaint extends Component implements IPaintSection {
    event: ExtendedEvents<this, Component, IPaintSectionEvents>;
    private readonly dropdown;
    private npc;
    constructor();
    getTilePaintData(): {
        npc: {
            type: "remove" | NPCType;
        };
    } | undefined;
    isChanging(): boolean;
    reset(): void;
    private changeNPC;
}
