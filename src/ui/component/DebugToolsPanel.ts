import { Events } from "event/EventBuses";
import { IEventEmitter } from "event/EventEmitter";
import Translation from "language/Translation";
import Component from "newui/component/Component";

import { DebugToolsTranslation } from "../../IDebugTools";

interface IDebugToolsPanelEvents extends Events<Component> {
	switchTo(): any;
	switchAway(): any;
}

export default abstract class DebugToolsPanel extends Component {
	@Override public event: IEventEmitter<this, IDebugToolsPanelEvents>;

	public abstract getTranslation(): DebugToolsTranslation | Translation;
}
