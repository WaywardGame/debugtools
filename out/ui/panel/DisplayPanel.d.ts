import DebugTools from "../../DebugTools";
import { DebugToolsTranslation, ISaveData } from "../../IDebugTools";
import DebugToolsPanel from "../component/DebugToolsPanel";
export default class DisplayPanel extends DebugToolsPanel {
    private readonly zoomRange;
    readonly DEBUG_TOOLS: DebugTools;
    saveData: ISaveData;
    constructor();
    getTranslation(): DebugToolsTranslation;
    getZoomLevel(): number | undefined;
    toggleFog(_: any, fog: boolean): void;
    toggleLighting(_: any, lighting: boolean): void;
    protected onSwitchTo(): void;
    protected onSwitchAway(): void;
    private resetWebGL;
    private reloadShaders;
}
