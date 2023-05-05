import Tile from "game/tile/Tile";
import Log from "utilities/Log";
import DebugTools from "../../DebugTools";
import InspectInformationSection, { TabInformation } from "../component/InspectInformationSection";
export default class DoodadInformation extends InspectInformationSection {
    readonly DEBUG_TOOLS: DebugTools;
    readonly LOG: Log;
    private doodad;
    private readonly buttonGrowthStage;
    constructor();
    protected onSwitchTo(): void;
    getTabs(): TabInformation[];
    update(tile: Tile): void;
    logUpdate(): void;
    private removeDoodad;
    private cloneDoodad;
    private setGrowthStage;
}
