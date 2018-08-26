import IGameScreenApi from "newui/screen/screens/game/IGameScreenApi";
import { DebugToolsTranslation } from "../../IDebugTools";
import DebugToolsPanel from "../component/DebugToolsPanel";
export default class SelectionPanel extends DebugToolsPanel {
    private readonly dropdownMethod;
    private readonly rangeQuantity;
    private readonly dropdownAction;
    private creatures;
    private npcs;
    private action;
    private method;
    constructor(gsapi: IGameScreenApi);
    getTranslation(): DebugToolsTranslation;
    execute(): void;
    private changeMethod;
}
