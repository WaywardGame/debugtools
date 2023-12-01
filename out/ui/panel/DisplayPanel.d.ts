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
import { RenderLayerFlag } from "@wayward/game/renderer/world/IWorldRenderer";
import DebugTools from "../../DebugTools";
import { DebugToolsTranslation, ISaveData } from "../../IDebugTools";
import DebugToolsPanel from "../component/DebugToolsPanel";
export default class DisplayPanel extends DebugToolsPanel {
    private readonly zoomRange;
    readonly DEBUG_TOOLS: DebugTools;
    saveData: ISaveData;
    constructor();
    getTranslation(): DebugToolsTranslation;
    toggleFog(_: any, fog: boolean): void;
    toggleLighting(_: any, lighting: boolean): void;
    protected onSwitchTo(): void;
    protected onUpdateZoom(): void;
    private resetRenderer;
    private loseWebGlContext;
    private refreshTiles;
    private reloadShaders;
    private updateRenderLayerFlag;
    protected getRenderFlags(): RenderLayerFlag;
}
