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
import Translation from "language/Translation";
import TabDialogPanel from "ui/screen/screens/game/component/TabDialogPanel";
import { DebugToolsTranslation } from "../../IDebugTools";
export default abstract class DebugToolsPanel extends TabDialogPanel {
    abstract getTranslation(): DebugToolsTranslation | Translation;
}
