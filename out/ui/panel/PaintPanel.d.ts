/*!
 * Copyright 2011-2023 Unlok
 * https://www.unlok.ca
 *
 * Credits & Thanks:
 * https://www.unlok.ca/credits-thanks/
 *
 * Wayward is a copyrighted and licensed work. Modification and/or distribution of any source files is prohibited. If you wish to modify the game in any way, please refer to the modding guide:
 * https://github.com/WaywardGame/types/wiki
 */
import { Events, IEventEmitter } from "event/EventEmitter";
import { DoodadType } from "game/doodad/IDoodad";
import { CreatureType } from "game/entity/creature/ICreature";
import { NPCType } from "game/entity/npc/INPCs";
import { TerrainType } from "game/tile/ITerrain";
import { TileEventType } from "game/tile/ITileEvent";
import Component from "ui/component/Component";
import { IBindHandlerApi } from "ui/input/Bind";
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
    private lastPaintTile?;
    constructor();
    getTranslation(): DebugToolsTranslation;
    protected canClientMove(): false | undefined;
    protected onContextMenuBind(api: IBindHandlerApi): boolean;
    protected onStartPaintOrErasePaint(api: IBindHandlerApi): boolean;
    protected onPaint(api: IBindHandlerApi): boolean;
    protected onErasePaint(api: IBindHandlerApi): boolean;
    protected onStopPaint(api: IBindHandlerApi): boolean;
    protected onCancelPaint(): boolean;
    protected onClearPaint(): boolean;
    protected onCompletePaint(): boolean;
    protected onSwitchTo(): void;
    protected onSwitchAway(): void;
    protected onWillRemove(): void;
    private onPaintSectionChange;
    private showPaintSectionResetMenu;
    private completePaint;
    private clearPaint;
}
export {};
