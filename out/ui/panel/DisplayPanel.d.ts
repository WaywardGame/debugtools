import IGameScreenApi from "newui/screen/screens/game/IGameScreenApi";
import { DebugToolsTranslation } from "../../IDebugTools";
import DebugToolsPanel from "../component/DebugToolsPanel";
export default class DisplayPanel extends DebugToolsPanel {
    private readonly zoomRange;
    private readonly saveData;
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
