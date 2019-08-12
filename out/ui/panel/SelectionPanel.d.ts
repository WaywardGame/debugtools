import { DebugToolsTranslation } from "../../IDebugTools";
import DebugToolsPanel from "../component/DebugToolsPanel";
export default class SelectionPanel extends DebugToolsPanel {
    private readonly creatures;
    private readonly npcs;
    private readonly tileEvents;
    private readonly doodads;
    private readonly corpses;
    private readonly players;
    private readonly rangeQuantity;
    private readonly dropdownMethod;
    private readonly dropdownMethodWrapper;
    private readonly dropdownAlternativeTarget;
    private readonly dropdownAction;
    constructor();
    getTranslation(): DebugToolsTranslation;
    execute(): void;
    private onActionChange;
}
