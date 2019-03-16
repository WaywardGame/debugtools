import { DoodadType } from "doodad/IDoodad";
import Component from "newui/component/Component";
import { IPaintSection } from "../panel/PaintPanel";
export default class DoodadPaint extends Component implements IPaintSection {
    private readonly dropdown;
    private doodad;
    constructor();
    getTilePaintData(): {
        doodad: {
            type: DoodadType | "remove";
        };
    } | undefined;
    isChanging(): boolean;
    reset(): void;
    private changeDoodad;
}
