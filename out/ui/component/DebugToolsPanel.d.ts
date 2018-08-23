import Component from "newui/component/Component";
import IGameScreenApi from "newui/screen/screens/game/IGameScreenApi";
import { DebugToolsTranslation } from "../../IDebugTools";
export declare enum DebugToolsPanelEvent {
    SwitchTo = "SwitchTo",
    SwitchAway = "SwitchAway"
}
export default abstract class DebugToolsPanel extends Component {
    protected readonly gsapi: IGameScreenApi;
    constructor(gsapi: IGameScreenApi);
    abstract getTranslation(): DebugToolsTranslation;
}
