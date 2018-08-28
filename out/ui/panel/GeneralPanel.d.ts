import { Bindable } from "Enums";
import { BindCatcherApi } from "newui/BindingManager";
import IGameScreenApi from "newui/screen/screens/game/IGameScreenApi";
import { DebugToolsTranslation } from "../../IDebugTools";
import DebugToolsPanel from "../component/DebugToolsPanel";
export default class GeneralPanel extends DebugToolsPanel {
    private readonly timeRange;
    private readonly inspectButton;
    private readonly checkButtonAudio;
    private readonly dropdownAudio;
    private readonly dropdownParticle;
    private readonly checkButtonParticle;
    private selectionPromise;
    constructor(gsapi: IGameScreenApi);
    getTranslation(): DebugToolsTranslation;
    canClientMove(api: BindCatcherApi): false | undefined;
    onGameTickEnd(): void;
    onBindLoop(bindPressed: Bindable, api: BindCatcherApi): Bindable;
    private onSwitchTo;
    private onSwitchAway;
    private inspectTile;
    private unlockRecipes;
    private travelAway;
}
