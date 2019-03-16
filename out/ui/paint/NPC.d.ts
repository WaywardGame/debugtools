import { NPCType } from "entity/npc/NPCS";
import Component from "newui/component/Component";
import { IPaintSection } from "../panel/PaintPanel";
export default class NPCPaint extends Component implements IPaintSection {
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
