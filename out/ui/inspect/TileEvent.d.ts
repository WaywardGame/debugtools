import Tile from "game/tile/Tile";
import Log from "utilities/Log";
import InspectInformationSection, { TabInformation } from "../component/InspectInformationSection";
export default class TileEventInformation extends InspectInformationSection {
    readonly LOG: Log;
    private tileEvents;
    private tileEvent;
    constructor();
    getTabs(): TabInformation[];
    setTab(tileEvent: number): this;
    update(tile: Tile): void;
    logUpdate(): void;
    private removeTileEvent;
}
