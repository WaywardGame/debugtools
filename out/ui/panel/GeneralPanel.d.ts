import { Bindable, BindCatcherApi } from "newui/IBindingManager";
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
    private readonly checkButtonParticle;
    private selectionPromise;
    constructor();
    getTranslation(): DebugToolsTranslation;
    canClientMove(api: BindCatcherApi): false | undefined;
    onGameTickEnd(): void;
    onBindLoop(bindPressed: Bindable, api: BindCatcherApi): Bindable;
    protected onSwitchTo(): void;
    protected onSwitchAway(): void;
    private inspectTile;
    private unlockRecipes;
    private travelAway;
}
