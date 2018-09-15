import IGameScreenApi from "newui/screen/screens/game/IGameScreenApi";
import { ITile } from "tile/ITerrain";
import Log from "utilities/Log";
import { IVector2 } from "utilities/math/IVector";
import InspectInformationSection, { TabInformation } from "../component/InspectInformationSection";
export default class TileEventInformation extends InspectInformationSection {
    readonly LOG: Log;
    private tileEvents;
    private tileEvent;
    constructor(gsapi: IGameScreenApi);
    getTabs(): TabInformation[];
    setTab(tileEvent: number): this;
    update(position: IVector2, tile: ITile): void;
    logUpdate(): void;
    private removeTileEvent;
}
