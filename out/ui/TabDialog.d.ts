import Button from "newui/component/Button";
import Component from "newui/component/Component";
import { TranslationGenerator } from "newui/component/IComponent";
import Dialog from "newui/screen/screens/game/component/Dialog";
import { DialogId } from "newui/screen/screens/game/Dialogs";
import IGameScreenApi from "newui/screen/screens/game/IGameScreenApi";
export declare type SubpanelInformation = [string | number, TranslationGenerator, (component: Component) => any, ((button: Button) => any)?, Button?];
export default abstract class TabDialog extends Dialog {
    private readonly subpanelLinkWrapper;
    private readonly panelWrapper;
    private subpanelInformations;
    private activeSubpanel;
    constructor(gsapi: IGameScreenApi, id: DialogId);
    protected abstract getSubpanels(): SubpanelInformation[];
    protected updateSubpanelList(): void;
    protected showSubPanel(button: Button): void;
    protected showSubPanel(id: string | number): (link: Button) => void;
    private showFirstSubpanel;
    private switchSubpanel;
    private setActiveButton;
}
