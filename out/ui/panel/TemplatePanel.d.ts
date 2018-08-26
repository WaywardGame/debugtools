import { Bindable } from "Enums";
import { BindCatcherApi } from "newui/BindingManager";
import IGameScreenApi from "newui/screen/screens/game/IGameScreenApi";
import { DebugToolsTranslation } from "../../IDebugTools";
import DebugToolsPanel from "../component/DebugToolsPanel";
export default class TemplatePanel extends DebugToolsPanel {
    private readonly dropdownType;
    private readonly dropdownTemplate;
    private readonly mirrorVertically;
    private readonly mirrorHorizontally;
    private readonly rotate;
    private readonly degrade;
    private readonly place;
    private readonly previewTiles;
    private selectHeld;
    constructor(gsapi: IGameScreenApi);
    getTranslation(): DebugToolsTranslation;
    canClientMove(api: BindCatcherApi): false | undefined;
    onBindLoop(bindPressed: Bindable, api: BindCatcherApi): Bindable;
    private getTemplate;
    private templateHasTile;
    private getTemplateOptions;
    private onSwitchTo;
    private onSwitchAway;
    private changeTemplateType;
    private placeTemplate;
}
