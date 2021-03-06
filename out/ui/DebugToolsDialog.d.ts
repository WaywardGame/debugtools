import Translation from "language/Translation";
import TabDialog, { SubpanelInformation } from "ui/screen/screens/game/component/TabDialog";
import { DialogId, IDialogDescription } from "ui/screen/screens/game/Dialogs";
import DebugTools from "../DebugTools";
import DebugToolsPanel from "./component/DebugToolsPanel";
export declare type DebugToolsDialogPanelClass = new () => DebugToolsPanel;
export default class DebugToolsDialog extends TabDialog<DebugToolsPanel> {
    static description: IDialogDescription;
    readonly DEBUG_TOOLS: DebugTools;
    constructor(id: DialogId);
    getName(): Translation;
    protected getSubpanels(): DebugToolsPanel[];
    protected getSubpanelInformation(subpanels: DebugToolsPanel[]): SubpanelInformation[];
}
