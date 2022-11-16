import { ITile } from "game/tile/ITerrain";
import Log from "utilities/Log";
import { IVector2 } from "utilities/math/IVector";
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
    update(position: IVector2, tile: ITile): void;
    logUpdate(): void;
    private removeDoodad;
    private cloneDoodad;
    private setGrowthStage;
}
