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
import { TileUpdateType } from "@wayward/game/game/IGame";
import Entity from "@wayward/game/game/entity/Entity";
import Island from "@wayward/game/game/island/Island";
import Tile from "@wayward/game/game/tile/Tile";
import Translation from "@wayward/game/language/Translation";
import { IBindHandlerApi } from "@wayward/game/ui/input/Bind";
import { DialogId, IDialogDescription } from "@wayward/game/ui/screen/screens/game/Dialogs";
import TabDialog, { SubpanelInformation } from "@wayward/game/ui/screen/screens/game/component/TabDialog";
import Log from "@wayward/utilities/Log";
import { Events, IEventEmitter } from "@wayward/utilities/event/EventEmitter";
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
    onGameTickEnd(island: Island): void;
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
