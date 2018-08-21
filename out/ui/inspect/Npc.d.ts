import { UiApi } from "newui/INewUi";
import { INPC } from "npc/INPC";
import HumanInformation from "./Human";
export default class NpcInformation extends HumanInformation {
    private readonly npc;
    constructor(api: UiApi, npc: INPC);
    private removeNPC;
}
