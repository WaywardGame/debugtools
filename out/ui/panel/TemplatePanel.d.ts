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
import DebugTools from "../../DebugTools";
import { DebugToolsTranslation } from "../../IDebugTools";
import DebugToolsPanel from "../component/DebugToolsPanel";
export default class TemplatePanel extends DebugToolsPanel {
    readonly DEBUG_TOOLS: DebugTools;
    private readonly dropdownType;
    private readonly dropdownTemplate;
    private readonly mirrorVertically;
    private readonly mirrorHorizontally;
    private readonly overlap;
    private readonly rotate;
    private readonly degrade;
    private readonly place;
    private readonly previewTiles;
    private selectHeld;
    private center?;
    private templateOptions?;
    constructor();
    getTranslation(): DebugToolsTranslation;
    protected canClientMove(): false | undefined;
    protected onStopSelectLocation(): boolean;
    private tick;
    private updateTemplate;
    private getTemplate;
    private templateHasTile;
    private getTemplateOptions;
    private templateOptionsChanged;
    protected onSwitchTo(): void;
    protected onSwitchAway(): void;
    private changeTemplateType;
    private placeTemplate;
    private clearPreview;
}
