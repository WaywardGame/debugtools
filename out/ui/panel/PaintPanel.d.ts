import { Bindable, CreatureType, DoodadType, NPCType, SpriteBatchLayer, TerrainType } from "Enums";
import { BindCatcherApi } from "newui/BindingManager";
import Component from "newui/component/Component";
import IGameScreenApi from "newui/screen/screens/game/IGameScreenApi";
import { TileEventType } from "tile/ITileEvent";
import { DebugToolsTranslation } from "../../IDebugTools";
import DebugToolsPanel from "../component/DebugToolsPanel";
export interface IPaintData {
    terrain?: {
        type: TerrainType;
        tilled: boolean;
    };
    creature?: {
        type: CreatureType | "remove";
        aberrant: boolean;
    };
    npc?: {
        type: NPCType | "remove";
    };
    doodad?: {
        type: DoodadType | "remove";
    };
    corpse?: {
        type: CreatureType | "remove" | undefined;
        aberrant: boolean;
        replaceExisting: boolean;
    };
    tileEvent?: {
        type: TileEventType | "remove" | undefined;
        replaceExisting: boolean;
    };
}
export interface IPaintSection extends Component {
    isChanging(): boolean;
    reset(): void;
    getTilePaintData(): Partial<IPaintData> | undefined;
}
export default class PaintPanel extends DebugToolsPanel {
    private readonly paintSections;
    private paintButton;
    private paintRow;
    private painting;
    private readonly paintTiles;
    private lastPaintPosition?;
    private maxSprites;
    constructor(gsapi: IGameScreenApi);
    getTranslation(): DebugToolsTranslation;
    canClientMove(api: BindCatcherApi): false | undefined;
    getMaxSpritesForLayer(layer: SpriteBatchLayer, maxSprites: number): number | undefined;
    onBindLoop(bindPressed: Bindable, api: BindCatcherApi): Bindable;
    private updateOverlayBatch;
    private onSwitchTo;
    private onSwitchAway;
    private onPaintSectionChange;
    private showPaintSectionResetMenu;
    private completePaint;
    private clearPaint;
    private updatePaintOverlay;
    private getNeighborTiles;
    private getPaintOverlayConnections;
}
