import IGameScreenApi from "newui/screen/screens/game/IGameScreenApi";
import { DebugToolsTranslation } from "../../IDebugTools";
import DebugToolsPanel from "../component/DebugToolsPanel";
export declare enum SelectionType {
    Creature = 0,
    NPC = 1,
    TileEvent = 2
}
export default class SelectionPanel extends DebugToolsPanel {
    private readonly dropdownMethod;
    private readonly rangeQuantity;
    private readonly dropdownAction;
    private creatures;
    private npcs;
    private tileEvents;
    private action;
    private method;
    constructor(gsapi: IGameScreenApi);
    getTranslation(): DebugToolsTranslation;
    execute(): void;
    private changeMethod;
}
