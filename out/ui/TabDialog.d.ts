import { Events, IEventEmitter } from "event/EventEmitter";
import Button from "ui/component/Button";
import Component from "ui/component/Component";
import { TranslationGenerator } from "ui/component/IComponent";
import Dialog from "ui/screen/screens/game/component/Dialog";
import { DialogId } from "ui/screen/screens/game/Dialogs";
export declare type SubpanelInformation = [string | number, TranslationGenerator, (component: Component) => any, ((button: Button) => any)?, Button?];
interface ITabDialogEvents extends Events<Dialog> {
    changeSubpanel(): any;
}
export default abstract class TabDialog extends Dialog {
    event: IEventEmitter<this, ITabDialogEvents>;
    private readonly subpanelLinkWrapper;
    private readonly panelWrapper;
    private subpanelInformations;
    private activeSubpanel;
    constructor(id: DialogId);
    protected abstract getSubpanels(): SubpanelInformation[];
    protected updateSubpanelList(): void;
    protected showSubPanel(button: Button): void;
    protected showSubPanel(id: string | number): (link: Button) => void;
    private showFirstSubpanel;
    private switchSubpanel;
    private setActiveButton;
    private onResize;
}
export {};
