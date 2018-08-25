import { UiApi } from "newui/INewUi";
import { ITile } from "tile/ITerrain";
import { IVector2 } from "utilities/math/IVector";
import InspectInformationSection, { TabInformation } from "../component/InspectInformationSection";
export default class TileEventInformation extends InspectInformationSection {
    private tileEvents;
    private tileEvent;
    constructor(api: UiApi);
    getTabs(): TabInformation[];
    setTab(tileEvent: number): this;
    update(position: IVector2, tile: ITile): this | undefined;
    logUpdate(): void;
}
