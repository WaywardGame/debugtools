import Tile from "game/tile/Tile";
import Log from "utilities/Log";
import InspectInformationSection, { TabInformation } from "../component/InspectInformationSection";
export default class ItemInformation extends InspectInformationSection {
    readonly LOG: Log;
    private tile;
    getTabs(): TabInformation[];
    setTab(): this;
    update(tile: Tile): void;
    logUpdate(): void;
    private getTile;
}
