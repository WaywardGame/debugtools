import TranslationImpl from "@wayward/game/language/impl/TranslationImpl";
import { DebugToolsTranslation } from "../../IDebugTools";
import ActionHistory from "../ActionHistory";
import DebugToolsPanel from "../component/DebugToolsPanel";

export default class HistoryPanel extends DebugToolsPanel {

	public constructor() {
		super();
		new ActionHistory().appendTo(this);
	}

	public override getTranslation(): DebugToolsTranslation | TranslationImpl {
		return DebugToolsTranslation.PanelHistory;
	}
}