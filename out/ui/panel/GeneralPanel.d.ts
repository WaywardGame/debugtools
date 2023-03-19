import DebugTools from "../../DebugTools";
import { DebugToolsTranslation } from "../../IDebugTools";
import DebugToolsPanel from "../component/DebugToolsPanel";
export default class GeneralPanel extends DebugToolsPanel {
    readonly DEBUG_TOOLS: DebugTools;
    private readonly timeRange;
    private readonly inspectButton;
    private readonly checkButtonAudio;
    private readonly dropdownAudio;
    private readonly dropdownParticle;
    private readonly dropdownLayer;
    private readonly dropdownTravel;
    private readonly checkButtonParticle;
    private selectionPromise;
    constructor();
    getTranslation(): DebugToolsTranslation;
    canClientMove(): false | undefined;
    protected onChangeZ(_: any, z: number): void;
    onGameTickEnd(): void;
    protected onLoadOnIsland(): void;
    private selectionLogic;
    protected onSwitchTo(): void;
    protected onSwitchAway(): void;
    private changeLayer;
    private travel;
    private sailToCivilization;
    private renameIsland;
}
