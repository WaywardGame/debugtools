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
import InspectInformationSection, { TabInformation } from "../component/InspectInformationSection";
export default class TerrainInformation extends InspectInformationSection {
    readonly LOG: Log;
    private tile;
    private terrainType;
    private readonly dropdownTerrainType;
    private readonly checkButtonTilled;
    private readonly checkButtonIncludeNeighbors;
    constructor();
    getTabs(): TabInformation[];
    getTabTranslation(): import("../../../node_modules/@wayward/types/definitions/game/utilities/string/Interpolator").IStringSection[];
    update(tile: Tile): this | undefined;
    logUpdate(): void;
    private toggleTilled;
    private isTillable;
    private isTilled;
    private changeTerrain;
    refreshTile(): void;
}
