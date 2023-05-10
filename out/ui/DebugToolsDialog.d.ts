import Translation from "language/Translation";
import Bindable from "ui/input/Bindable";
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
    getBindable(): Bindable | undefined;
    protected getSubpanels(): DebugToolsPanel[];
    protected getSubpanelInformation(subpanels: DebugToolsPanel[]): SubpanelInformation[];
}
