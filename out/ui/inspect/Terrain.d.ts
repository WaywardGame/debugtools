import { UiApi } from "newui/INewUi";
import { ITile } from "tile/ITerrain";
import { IVector2 } from "utilities/math/IVector";
import InspectInformationSection, { TabInformation } from "../component/InspectInformationSection";
export default class TerrainInformation extends InspectInformationSection {
    private position;
    private tile;
    private terrainType;
    private readonly checkButtonTilled;
    constructor(api: UiApi);
    getTabs(): TabInformation[];
    getTabTranslation(): import("utilities/string/Interpolator").IStringSection[];
    update(position: IVector2, tile: ITile): this | undefined;
    logUpdate(): void;
    private toggleTilled;
    private showTerrainContextMenu;
    private changeTerrain;
}
