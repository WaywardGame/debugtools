import { ExtendedEvents } from "event/EventEmitter";
import Translation from "language/Translation";
import Component from "newui/component/Component";
import { DebugToolsTranslation } from "../../IDebugTools";
interface IDebugToolsPanelEvents {
    switchTo(): any;
    switchAway(): any;
}
export default abstract class DebugToolsPanel extends Component {
    event: ExtendedEvents<this, Component, IDebugToolsPanelEvents>;
    abstract getTranslation(): DebugToolsTranslation | Translation;
}
export {};
