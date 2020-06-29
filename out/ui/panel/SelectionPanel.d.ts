import DebugTools from "src/DebugTools";
import { DebugToolsTranslation } from "../../IDebugTools";
import DebugToolsPanel from "../component/DebugToolsPanel";
export default class SelectionPanel extends DebugToolsPanel {
    static DEBUG_TOOLS: DebugTools;
    private readonly targets;
    private readonly textPreposition;
    private readonly countRow;
    private readonly buttonExecute;
    private readonly creatures;
    private readonly npcs;
    private readonly tileEvents;
    private readonly doodads;
    private readonly corpses;
    private readonly players;
    private readonly rangeQuantity;
    private readonly dropdownMethod;
    private readonly dropdownAlternativeTarget;
    private readonly dropdownAction;
    constructor();
    getTranslation(): DebugToolsTranslation;
    execute(): void;
    private onActionChange;
    private onMethodChange;
    private updateTargets;
}
