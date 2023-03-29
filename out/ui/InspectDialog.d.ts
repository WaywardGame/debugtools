import { Events, IEventEmitter } from "event/EventEmitter";
import { TileUpdateType } from "game/IGame";
import Entity from "game/entity/Entity";
import Tile from "game/tile/Tile";
import Translation from "language/Translation";
import { IBindHandlerApi } from "ui/input/Bind";
import { DialogId, IDialogDescription } from "ui/screen/screens/game/Dialogs";
import TabDialog, { SubpanelInformation } from "ui/screen/screens/game/component/TabDialog";
import Log from "utilities/Log";
import DebugTools from "../DebugTools";
import InspectInformationSection from "./component/InspectInformationSection";
export type InspectDialogInformationSectionClass = new () => InspectInformationSection;
export interface IInspectDialogEvents extends Events<TabDialog<InspectInformationSection>> {
    updateSubpanels(): any;
}
export default class InspectDialog extends TabDialog<InspectInformationSection> {
    static description: IDialogDescription;
    static INSTANCE: InspectDialog | undefined;
    readonly DEBUG_TOOLS: DebugTools;
    readonly LOG: Log;
    readonly event: IEventEmitter<this, IInspectDialogEvents>;
    private entityButtons;
    private entityInfoSection;
    private tile?;
    private inspectionLock?;
    private inspectingTile?;
    private shouldLog;
    private willShowSubpanel;
    constructor(id: DialogId);
    protected getSubpanels(): InspectInformationSection[];
    protected getSubpanelInformation(subpanels: InspectInformationSection[]): SubpanelInformation[];
    getName(): Translation;
    setInspection(what: Tile | Entity): this;
    update(): void;
    onCloseBind(): boolean;
    onContextMenuBind(api: IBindHandlerApi): boolean;
    onGameEnd(): void;
    onGameTickEnd(): void;
    onMoveComplete(): void;
    onTileUpdate(island: any, tile: Tile, tileUpdateType: TileUpdateType): void;
    protected onClose(): void;
    private updateSubpanels;
    private setInspectionTile;
    private logUpdate;
    private showInspectionLockMenu;
    private unlockInspection;
    private lockInspection;
}
