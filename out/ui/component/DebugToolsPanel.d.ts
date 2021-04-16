import { Events, IEventEmitter } from "event/EventEmitter";
import Translation from "language/Translation";
import Component from "ui/component/Component";
import { DebugToolsTranslation } from "../../IDebugTools";
interface IDebugToolsPanelEvents extends Events<Component> {
    switchTo(): any;
    switchAway(): any;
}
export default abstract class DebugToolsPanel extends Component {
    event: IEventEmitter<this, IDebugToolsPanelEvents>;
    abstract getTranslation(): DebugToolsTranslation | Translation;
    protected onPanelShow(): void;
}
export {};
