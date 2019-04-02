import { DoodadType } from "doodad/IDoodad";
import { ExtendedEvents } from "event/EventEmitter";
import Component from "newui/component/Component";
import { IPaintSection, IPaintSectionEvents } from "../panel/PaintPanel";
export default class DoodadPaint extends Component implements IPaintSection {
    event: ExtendedEvents<this, Component, IPaintSectionEvents>;
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
