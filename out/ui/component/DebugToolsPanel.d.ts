import Translation from "language/Translation";
import TabDialogPanel from "ui/screen/screens/game/component/TabDialogPanel";
import { DebugToolsTranslation } from "../../IDebugTools";
export default abstract class DebugToolsPanel extends TabDialogPanel {
    abstract getTranslation(): DebugToolsTranslation | Translation;
}
