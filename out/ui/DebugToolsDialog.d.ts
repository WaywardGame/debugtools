import Translation from "language/Translation";
import { DialogId, IDialogDescription } from "newui/screen/screens/game/Dialogs";
import DebugTools from "../DebugTools";
import DebugToolsPanel from "./component/DebugToolsPanel";
import TabDialog, { SubpanelInformation } from "./TabDialog";
export declare type DebugToolsDialogPanelClass = new () => DebugToolsPanel;
export default class DebugToolsDialog extends TabDialog {
    static description: IDialogDescription;
    readonly DEBUG_TOOLS: DebugTools;
    private subpanels;
    private activePanel;
    private storePanels;
    constructor(id: DialogId);
    getName(): Translation;
    getSubpanels(): SubpanelInformation[];
    private onShowSubpanel;
}
