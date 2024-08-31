import Translation from "@wayward/game/language/Translation";
import TabDialogPanel from "@wayward/game/ui/screen/screens/game/component/TabDialogPanel";
import { DebugToolsTranslation } from "../../IDebugTools";

export default abstract class DebugToolsPanel extends TabDialogPanel {
	public abstract getTranslation(): DebugToolsTranslation | Translation;
}
