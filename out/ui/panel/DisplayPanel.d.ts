import IGameScreenApi from "newui/screen/screens/game/IGameScreenApi";
import DebugTools from "../../DebugTools";
import { DebugToolsTranslation, ISaveData } from "../../IDebugTools";
import DebugToolsPanel from "../component/DebugToolsPanel";
export default class DisplayPanel extends DebugToolsPanel {
    private readonly zoomRange;
    readonly DEBUG_TOOLS: DebugTools;
    saveData: ISaveData;
    constructor(gsapi: IGameScreenApi);
    getTranslation(): DebugToolsTranslation;
    getZoomLevel(): number | undefined;
    private onSwitchTo;
    private onSwitchAway;
    private toggleFog;
    private toggleLighting;
    private resetWebGL;
    private reloadShaders;
}
