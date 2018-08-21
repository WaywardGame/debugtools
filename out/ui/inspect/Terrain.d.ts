import Component from "newui/component/Component";
import { UiApi } from "newui/INewUi";
import { ITile } from "tile/ITerrain";
import { IVector2 } from "utilities/math/IVector";
import { IInspectInformationSection } from "../InspectDialog";
export default class TerrainInformation extends Component implements IInspectInformationSection {
    private position;
    private tile;
    private terrainType;
    private readonly title;
    private readonly checkButtonTilled;
    constructor(api: UiApi);
    update(position: IVector2, tile: ITile): this;
    private toggleTilled;
    private showTerrainContextMenu;
    private changeTerrain;
}
