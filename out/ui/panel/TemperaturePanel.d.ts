import DebugTools from "../../DebugTools";
import { DebugToolsTranslation, ISaveData } from "../../IDebugTools";
import DebugToolsPanel from "../component/DebugToolsPanel";
export default class TemperaturePanel extends DebugToolsPanel {
    readonly DEBUG_TOOLS: DebugTools;
    saveData: ISaveData;
    private biomeTimeModifier;
    private layerTimeModifier;
    constructor();
    getTranslation(): DebugToolsTranslation;
    protected onChangeArea(): void;
    protected onTime(): void;
}
