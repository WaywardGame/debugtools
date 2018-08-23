import Component from "newui/component/Component";
import IGameScreenApi from "newui/screen/screens/game/IGameScreenApi";
import { DebugToolsTranslation } from "../../IDebugTools";

export enum DebugToolsPanelEvent {
	SwitchTo = "SwitchTo",
	SwitchAway = "SwitchAway",
}

export default abstract class DebugToolsPanel extends Component {
	public constructor(protected readonly gsapi: IGameScreenApi) {
		super(gsapi.uiApi);
	}

	public abstract getTranslation(): DebugToolsTranslation;
}
