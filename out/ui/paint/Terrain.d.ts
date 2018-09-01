import { TerrainType } from "Enums";
import Component from "newui/component/Component";
import { UiApi } from "newui/INewUi";
import { IPaintSection } from "../panel/PaintPanel";
export default class TerrainPaint extends Component implements IPaintSection {
    private readonly tilledCheckButton;
    private terrain;
    private dropdown;
    constructor(api: UiApi);
    getTilePaintData(): {
        terrain: {
            type: TerrainType;
            tilled: boolean;
        };
    } | undefined;
    isChanging(): boolean;
    reset(): void;
    private changeTerrain;
}
