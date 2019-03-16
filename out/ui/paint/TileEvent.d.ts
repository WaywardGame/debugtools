import Component from "newui/component/Component";
import { TileEventType } from "tile/ITileEvent";
import { IPaintSection } from "../panel/PaintPanel";
export default class TileEventPaint extends Component implements IPaintSection {
    private readonly dropdown;
    private readonly replaceExisting;
    private tileEvent;
    constructor();
    getTilePaintData(): {
        tileEvent: {
            type: "remove" | TileEventType | undefined;
            replaceExisting: boolean;
        };
    };
    isChanging(): boolean;
    reset(): void;
    private changeEvent;
}
