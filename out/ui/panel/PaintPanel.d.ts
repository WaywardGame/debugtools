import { DoodadType } from "doodad/IDoodad";
import { CreatureType } from "entity/creature/ICreature";
import { NPCType } from "entity/npc/NPCS";
import { Events } from "event/EventBuses";
import { IEventEmitter } from "event/EventEmitter";
import Component from "newui/component/Component";
import { Bindable, BindCatcherApi } from "newui/IBindingManager";
import { SpriteBatchLayer } from "renderer/IWorldRenderer";
import { TerrainType } from "tile/ITerrain";
import { TileEventType } from "tile/ITileEvent";
import DebugTools from "../../DebugTools";
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
interface IPaintSectionEvents extends Events<Component> {
    change(): any;
}
export interface IPaintSection extends Component {
    event: IEventEmitter<this, IPaintSectionEvents>;
    isChanging(): boolean;
    reset(): void;
    getTilePaintData(): Partial<IPaintData> | undefined;
}
export default class PaintPanel extends DebugToolsPanel {
    readonly DEBUG_TOOLS: DebugTools;
    private readonly paintSections;
    private readonly paintButton;
    private readonly paintRow;
    private readonly paintRadius;
    private painting;
    private readonly paintTiles;
    private lastPaintPosition?;
    private maxSprites;
    constructor();
    getTranslation(): DebugToolsTranslation;
    canClientMove(): false | undefined;
    getMaxSpritesForLayer(_: any, layer: SpriteBatchLayer, maxSprites: number): number | undefined;
    onBindLoop(bindPressed: Bindable, api: BindCatcherApi): Bindable;
    protected onSwitchTo(): void;
    protected onSwitchAway(): void;
    private updateOverlayBatch;
    private onPaintSectionChange;
    private showPaintSectionResetMenu;
    private completePaint;
    private clearPaint;
}
export {};
