import IGameScreenApi from "newui/screen/screens/game/IGameScreenApi";
import { ITile } from "tile/ITerrain";
import Log from "utilities/Log";
import { IVector2 } from "utilities/math/IVector";
import DebugTools from "../../DebugTools";
import InspectInformationSection, { TabInformation } from "../component/InspectInformationSection";
export default class DoodadInformation extends InspectInformationSection {
    readonly DEBUG_TOOLS: DebugTools;
    readonly LOG: Log;
    private doodad;
    private readonly buttonGrowthStage;
    constructor(gsapi: IGameScreenApi);
    getTabs(): TabInformation[];
    update(position: IVector2, tile: ITile): void;
    logUpdate(): void;
    private addItem;
    private removeDoodad;
    private cloneDoodad;
    private setGrowthStage;
}
