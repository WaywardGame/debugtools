import TranslationImpl from "@wayward/game/language/impl/TranslationImpl";
import { OwnEventHandler } from "@wayward/utilities/event/EventManager";
import { DebugToolsTranslation } from "../../IDebugTools";
import ActionHistory from "../ActionHistory";
import DebugToolsPanel from "../component/DebugToolsPanel";

export default class HistoryPanel extends DebugToolsPanel {

	private actionHistory?: ActionHistory;

	public override getTranslation(): DebugToolsTranslation | TranslationImpl {
		return DebugToolsTranslation.PanelHistory;
	}

	@OwnEventHandler(HistoryPanel, "switchTo")
	protected onSwitchTo() {
		this.actionHistory?.remove();
		this.actionHistory = new ActionHistory().appendTo(this);
	}

	@OwnEventHandler(HistoryPanel, "switchAway")
	protected onSwitchAway() {
		this.actionHistory?.remove();
		delete this.actionHistory;
	}
}