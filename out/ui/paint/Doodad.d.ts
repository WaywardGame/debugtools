import { Events, IEventEmitter } from "event/EventEmitter";
import { DoodadType } from "game/doodad/IDoodad";
import Component from "ui/component/Component";
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
