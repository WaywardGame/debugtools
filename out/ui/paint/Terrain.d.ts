import { ExtendedEvents } from "event/EventEmitter";
import Component from "newui/component/Component";
import { TerrainType } from "tile/ITerrain";
import { IPaintSection, IPaintSectionEvents } from "../panel/PaintPanel";
export default class TerrainPaint extends Component implements IPaintSection {
    event: ExtendedEvents<this, Component, IPaintSectionEvents>;
    private readonly tilledCheckButton;
    private terrain;
    private dropdown;
    constructor();
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
