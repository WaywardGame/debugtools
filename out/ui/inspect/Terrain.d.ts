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
