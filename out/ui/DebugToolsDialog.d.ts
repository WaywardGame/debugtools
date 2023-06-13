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
import Translation from "language/Translation";
import { DialogId, IDialogDescription } from "ui/screen/screens/game/Dialogs";
import TabDialog, { SubpanelInformation } from "ui/screen/screens/game/component/TabDialog";
import DebugTools from "../DebugTools";
import DebugToolsPanel from "./component/DebugToolsPanel";
export type DebugToolsDialogPanelClass = new () => DebugToolsPanel;
export default class DebugToolsDialog extends TabDialog<DebugToolsPanel> {
    static description: IDialogDescription;
    readonly DEBUG_TOOLS: DebugTools;
    private current;
    constructor(id: DialogId);
    getName(): Translation;
    getBindable(): import("../../node_modules/@wayward/types/definitions/game/ui/input/Bindable").default;
    getIcon(): import("../../node_modules/@wayward/types/definitions/game/ui/screen/screens/game/static/menubar/IMenuBarButton").MenuBarButtonType;
    protected getDefaultSubpanelInformation(): SubpanelInformation | undefined;
    protected onChangeSubpanel(activeSubpanel: SubpanelInformation): void;
    protected getSubpanels(): DebugToolsPanel[];
    protected getSubpanelInformation(subpanels: DebugToolsPanel[]): SubpanelInformation[];
}
