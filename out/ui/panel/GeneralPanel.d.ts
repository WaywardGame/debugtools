import { BindCatcherApi } from "newui/BindingManager";
import IGameScreenApi from "newui/screen/screens/game/IGameScreenApi";
import { DebugToolsTranslation } from "../../IDebugTools";
import DebugToolsPanel from "../component/DebugToolsPanel";
export default class GeneralPanel extends DebugToolsPanel {
    private timeRange;
    private inspectButton;
    private selectionPromise;
    constructor(gsapi: IGameScreenApi);
    getTranslation(): DebugToolsTranslation;
    canClientMove(api: BindCatcherApi): false | undefined;
    onGameTickEnd(): void;
    private onSwitchTo;
    private onSwitchAway;
    private inspectLocalPlayer;
    private inspectTile;
    private unlockRecipes;
    private removeAllCreatures;
    private removeAllNPCs;
    private travelAway;
}
