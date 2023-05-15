/*!
 * Copyright 2011-2023 Unlok
 * https://www.unlok.ca
 *
 * Credits & Thanks:
 * https://www.unlok.ca/credits-thanks/
 *
 * Wayward is a copyrighted and licensed work. Modification and/or distribution of any source files is prohibited. If you wish to modify the game in any way, please refer to the modding guide:
 * https://github.com/WaywardGame/types/wiki
 */
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
