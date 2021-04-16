import { Events, IEventEmitter } from "event/EventEmitter";
import { TileEventType } from "game/tile/ITileEvent";
import Component from "ui/component/Component";
import { IPaintSection } from "../panel/PaintPanel";
export default class TileEventPaint extends Component implements IPaintSection {
    event: IEventEmitter<this, Events<IPaintSection>>;
    private readonly dropdown;
    private readonly replaceExisting;
    private tileEvent;
    constructor();
    getTilePaintData(): {
        tileEvent: {
            type: TileEventType | "remove" | undefined;
            replaceExisting: boolean;
        };
    };
    isChanging(): boolean;
    reset(): void;
    private changeEvent;
}
