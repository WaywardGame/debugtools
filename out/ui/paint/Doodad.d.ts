import { DoodadType } from "Enums";
import Component from "newui/component/Component";
import { UiApi } from "newui/INewUi";
import { IPaintSection } from "../panel/PaintPanel";
export default class DoodadPaint extends Component implements IPaintSection {
    private readonly dropdown;
    private doodad;
    constructor(api: UiApi);
    getTilePaintData(): {
        doodad: {
            type: DoodadType | "remove";
        };
    } | undefined;
    isChanging(): boolean;
    reset(): void;
    private changeDoodad;
}
