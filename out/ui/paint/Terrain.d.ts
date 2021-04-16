import { Events, IEventEmitter } from "event/EventEmitter";
import { TerrainType } from "game/tile/ITerrain";
import Component from "ui/component/Component";
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
