import Component from "newui/component/Component";
import { UiApi } from "newui/INewUi";
import { TileEventType } from "tile/ITileEvent";
import { IPaintSection } from "../DebugToolsDialog";
export default class TileEventPaint extends Component implements IPaintSection {
    private readonly replaceExisting;
    private tileEvent;
    constructor(api: UiApi);
    getTilePaintData(): {
        tileEvent: {
            type: TileEventType | "remove" | undefined;
            replaceExisting: boolean;
        };
    };
    private changeEvent;
}
