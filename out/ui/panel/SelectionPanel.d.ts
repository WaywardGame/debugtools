import { DebugToolsTranslation } from "../../IDebugTools";
import DebugToolsPanel from "../component/DebugToolsPanel";
export declare enum SelectionType {
    Creature = 0,
    NPC = 1,
    TileEvent = 2
}
export default class SelectionPanel extends DebugToolsPanel {
    private readonly rangeQuantity;
    private creatures;
    private npcs;
    private tileEvents;
    private action;
    private method;
    constructor();
    getTranslation(): DebugToolsTranslation;
    execute(): void;
    private changeMethod;
}
