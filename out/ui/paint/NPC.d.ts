import { NPCType } from "Enums";
import Component from "newui/component/Component";
import { UiApi } from "newui/INewUi";
import { IPaintSection } from "../DebugToolsDialog";
export default class NPCPaint extends Component implements IPaintSection {
    private npc;
    constructor(api: UiApi);
    getTilePaintData(): {
        npc: {
            type: NPCType | "remove";
        };
    } | undefined;
    private changeNPC;
}
