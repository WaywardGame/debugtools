import { IHookHost } from "mod/IHookHost";
import { DialogId, IDialogDescription } from "newui/screen/screens/game/Dialogs";
import IGameScreenApi from "newui/screen/screens/game/IGameScreenApi";
import TabDialog, { SubpanelInformation } from "./TabDialog";
export default class DebugToolsDialog extends TabDialog implements IHookHost {
    static description: IDialogDescription;
    private subpanels;
    private activePanel;
    constructor(gsapi: IGameScreenApi, id: DialogId);
    getName(): import("language/Translation").default;
    getSubpanels(): SubpanelInformation[];
    private onShowSubpanel;
}
