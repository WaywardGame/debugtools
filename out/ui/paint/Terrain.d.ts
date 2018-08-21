import { TerrainType } from "Enums";
import Component from "newui/component/Component";
import { UiApi } from "newui/INewUi";
import { IPaintSection } from "../DebugToolsDialog";
export default class TerrainPaint extends Component implements IPaintSection {
    private readonly tilledCheckButton;
    private terrain;
    constructor(api: UiApi);
    getTilePaintData(): {
        terrain: {
            type: TerrainType;
            tilled: boolean;
        };
    } | undefined;
    private changeTerrain;
}
