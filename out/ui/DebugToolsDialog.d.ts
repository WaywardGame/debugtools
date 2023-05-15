import Translation from "language/Translation";
import { DialogId, IDialogDescription } from "ui/screen/screens/game/Dialogs";
import TabDialog, { SubpanelInformation } from "ui/screen/screens/game/component/TabDialog";
import DebugTools from "../DebugTools";
import DebugToolsPanel from "./component/DebugToolsPanel";
export type DebugToolsDialogPanelClass = new () => DebugToolsPanel;
export default class DebugToolsDialog extends TabDialog<DebugToolsPanel> {
    static description: IDialogDescription;
    readonly DEBUG_TOOLS: DebugTools;
    constructor(id: DialogId);
    getName(): Translation;
    getBindable(): import("../../node_modules/@wayward/types/definitions/game/ui/input/Bindable").default;
    getIcon(): import("../../node_modules/@wayward/types/definitions/game/ui/screen/screens/game/static/menubar/IMenuBarButton").MenuBarButtonType;
    protected getSubpanels(): DebugToolsPanel[];
    protected getSubpanelInformation(subpanels: DebugToolsPanel[]): SubpanelInformation[];
}
