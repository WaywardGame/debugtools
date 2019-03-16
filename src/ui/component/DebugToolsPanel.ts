import Translation from "language/Translation";
import Component from "newui/component/Component";
import { DebugToolsTranslation } from "../../IDebugTools";

export enum DebugToolsPanelEvent {
	SwitchTo = "SwitchTo",
	SwitchAway = "SwitchAway",
}

export default abstract class DebugToolsPanel extends Component {
	public abstract getTranslation(): DebugToolsTranslation | Translation;
}
