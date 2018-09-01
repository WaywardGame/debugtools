import { NPCType } from "Enums";
import Component from "newui/component/Component";
import { UiApi } from "newui/INewUi";
import { IPaintSection } from "../panel/PaintPanel";
export default class NPCPaint extends Component implements IPaintSection {
    private readonly dropdown;
    private npc;
    constructor(api: UiApi);
    getTilePaintData(): {
        npc: {
            type: NPCType | "remove";
        };
    } | undefined;
    isChanging(): boolean;
    reset(): void;
    private changeNPC;
}
