/*!
 * Copyright 2011-2023 Unlok
 * https://www.unlok.ca
 *
 * Credits & Thanks:
 * https://www.unlok.ca/credits-thanks/
 *
 * Wayward is a copyrighted and licensed work. Modification and/or distribution of any source files is prohibited. If you wish to modify the game in any way, please refer to the modding guide:
 * https://github.com/WaywardGame/types/wiki
 */

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