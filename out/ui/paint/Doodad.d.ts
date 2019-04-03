import { DoodadType } from "doodad/IDoodad";
import { Events } from "event/EventBuses";
import { IEventEmitter } from "event/EventEmitter";
import Component from "newui/component/Component";
import { IPaintSection } from "../panel/PaintPanel";
export default class DoodadPaint extends Component implements IPaintSection {
    event: IEventEmitter<this, Events<IPaintSection>>;
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
