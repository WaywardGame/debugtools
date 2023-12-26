import TranslationImpl from "@wayward/game/language/impl/TranslationImpl";
import { DebugToolsTranslation } from "../../IDebugTools";
import DebugToolsPanel from "../component/DebugToolsPanel";
export default class HistoryPanel extends DebugToolsPanel {
    constructor();
    getTranslation(): DebugToolsTranslation | TranslationImpl;
}
