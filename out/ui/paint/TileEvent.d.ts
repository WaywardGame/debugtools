import { ExtendedEvents } from "event/EventEmitter";
import Component from "newui/component/Component";
import { TileEventType } from "tile/ITileEvent";
import { IPaintSection, IPaintSectionEvents } from "../panel/PaintPanel";
export default class TileEventPaint extends Component implements IPaintSection {
    event: ExtendedEvents<this, Component, IPaintSectionEvents>;
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
