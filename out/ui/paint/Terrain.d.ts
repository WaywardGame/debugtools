import { Events } from "event/EventEmitter";
import { IEventEmitter } from "event/EventEmitter";
import Component from "newui/component/Component";
import { TerrainType } from "tile/ITerrain";
import { IPaintSection } from "../panel/PaintPanel";
export default class TerrainPaint extends Component implements IPaintSection {
    event: IEventEmitter<this, Events<IPaintSection>>;
    private readonly tilledCheckButton;
    private terrain;
    private readonly dropdown;
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
