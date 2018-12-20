import IGameScreenApi from "newui/screen/screens/game/IGameScreenApi";
import { ITile } from "tile/ITerrain";
import Log from "utilities/Log";
import { IVector2 } from "utilities/math/IVector";
import InspectInformationSection, { TabInformation } from "../component/InspectInformationSection";
export default class TerrainInformation extends InspectInformationSection {
    readonly LOG: Log;
    private position;
    private tile;
    private terrainType;
    private readonly checkButtonTilled;
    private readonly dropdownTerrainType;
    constructor(gsapi: IGameScreenApi);
    getTabs(): TabInformation[];
    getTabTranslation(): import("../../../mod-reference/definitions/utilities/string/Interpolator").IStringSection[];
    update(position: IVector2, tile: ITile): this | undefined;
    logUpdate(): void;
    private toggleTilled;
    private changeTerrain;
}
