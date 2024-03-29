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
import { DebugToolsTranslation, ISaveData } from "../../IDebugTools";
import DebugToolsPanel from "../component/DebugToolsPanel";
export default class TemperaturePanel extends DebugToolsPanel {
    readonly DEBUG_TOOLS: DebugTools;
    saveData: ISaveData;
    private biomeTimeModifier;
    private layerTimeModifier;
    constructor();
    getTranslation(): DebugToolsTranslation;
    protected onChangeArea(): void;
    protected onTime(): void;
}
