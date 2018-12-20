import Translation from "language/Translation";
import { IHookHost } from "mod/IHookHost";
import { DialogId, IDialogDescription } from "newui/screen/screens/game/Dialogs";
import IGameScreenApi from "newui/screen/screens/game/IGameScreenApi";
import DebugTools from "../DebugTools";
import DebugToolsPanel from "./component/DebugToolsPanel";
import TabDialog, { SubpanelInformation } from "./TabDialog";
export declare type DebugToolsDialogPanelClass = new (gsapi: IGameScreenApi) => DebugToolsPanel;
export default class DebugToolsDialog extends TabDialog implements IHookHost {
    static description: IDialogDescription;
    readonly DEBUG_TOOLS: DebugTools;
    private subpanels;
    private activePanel;
    private storePanels;
    constructor(gsapi: IGameScreenApi, id: DialogId);
    getName(): Translation;
    getSubpanels(): SubpanelInformation[];
    private onShowSubpanel;
}
