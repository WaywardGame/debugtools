/*!
 * Copyright 2011-2024 Unlok
 * https://www.unlok.ca
 *
 * Credits & Thanks:
 * https://www.unlok.ca/credits-thanks/
 *
 * Wayward is a copyrighted and licensed work. Modification and/or distribution of any source files is prohibited. If you wish to modify the game in any way, please refer to the modding guide:
 * https://github.com/WaywardGame/types/wiki
 */

import Translation from "@wayward/game/language/Translation";
import TabDialogPanel from "@wayward/game/ui/screen/screens/game/component/TabDialogPanel";
import { DebugToolsTranslation } from "../../IDebugTools";

export default abstract class DebugToolsPanel extends TabDialogPanel {
	public abstract getTranslation(): DebugToolsTranslation | Translation;
}
