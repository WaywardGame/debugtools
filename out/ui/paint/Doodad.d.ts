import { DoodadType } from "Enums";
import Component from "newui/component/Component";
import { UiApi } from "newui/INewUi";
import { IPaintSection } from "../DebugToolsDialog";
export default class DoodadPaint extends Component implements IPaintSection {
    private doodad;
    constructor(api: UiApi);
    getTilePaintData(): {
        doodad: {
            type: DoodadType | "remove";
        };
    } | undefined;
    private changeDoodad;
}
