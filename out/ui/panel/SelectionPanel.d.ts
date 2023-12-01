/*!
 * Copyright 2011-2023 Unlok
 * https://www.unlok.ca
 *
 * Credits & Thanks:
 * https://www.unlok.ca/credits-thanks/
 *
 * Wayward is a copyrighted and licensed work. Modification and/or distribution of any source files is prohibited. If you wish to modify the game in any way, please refer to the modding guide:
 * https://github.com/WaywardGame/types/wiki
 */
import Island from "@wayward/game/game/island/Island";
import { IBindHandlerApi } from "@wayward/game/ui/input/Bind";
import DebugTools from "../../DebugTools";
import { DebugToolsTranslation } from "../../IDebugTools";
import DebugToolsPanel from "../component/DebugToolsPanel";
export default class SelectionPanel extends DebugToolsPanel {
    static DEBUG_TOOLS: DebugTools;
    private readonly targets;
    private readonly selectionContainer;
    private readonly textPreposition;
    private readonly countRow;
    private readonly buttonPreviewPrevious;
    private readonly buttonPreviewNext;
    private readonly previewWrapper;
    private canvas;
    private zoomLevel;
    private readonly buttonExecute;
    private readonly rangeQuantity;
    private readonly dropdownMethod;
    private readonly buttonReroll;
    private readonly dropdownAlternativeTarget;
    private readonly dropdownAction;
    private targetIslandId;
    private creatures?;
    private npcs?;
    private tileEvents?;
    private doodads?;
    private corpses?;
    private players?;
    private treasure?;
    private renderer?;
    private previewCursor;
    constructor();
    getTranslation(): DebugToolsTranslation;
    private setupSelectionSources;
    execute(): void;
    protected onAppend(): Promise<void>;
    protected onSwitchTo(): void;
    protected onSwitchAway(): void;
    protected onDispose(): void;
    private disposeRenderer;
    private disposeRendererAndCanvas;
    private onActionChange;
    private onMethodChange;
    private updateTargets;
    private resize;
    onZoomIn(api: IBindHandlerApi): boolean;
    private updatePreview;
    private rerender;
    onTickEnd(island: Island): void;
}
