import Component from "newui/component/Component";
import { UiApi } from "newui/INewUi";
import { TileEventType } from "tile/ITileEvent";
import { IPaintSection } from "../panel/PaintPanel";
export default class TileEventPaint extends Component implements IPaintSection {
    private readonly dropdown;
    private readonly replaceExisting;
    private tileEvent;
    constructor(api: UiApi);
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
