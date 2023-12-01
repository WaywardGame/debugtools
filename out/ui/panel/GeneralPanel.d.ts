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
import { WorldZ } from "@wayward/utilities/game/WorldZ";
import DebugTools from "../../DebugTools";
import { DebugToolsTranslation } from "../../IDebugTools";
import DebugToolsPanel from "../component/DebugToolsPanel";
export default class GeneralPanel extends DebugToolsPanel {
    readonly DEBUG_TOOLS: DebugTools;
    private readonly timeRange;
    private readonly inspectButton;
    private readonly checkButtonAudio;
    private readonly dropdownAudio;
    private readonly dropdownParticle;
    private readonly dropdownLayer;
    private readonly dropdownTravel;
    private readonly checkButtonParticle;
    private selectionPromise;
    constructor();
    getTranslation(): DebugToolsTranslation;
    canClientMove(): false | undefined;
    protected onChangeZ(_: any, z: WorldZ): void;
    onGameTickEnd(): void;
    private selectionLogic;
    protected onSwitchTo(): void;
    protected onSwitchAway(): void;
    private changeLayer;
    private travel;
    private sailToCivilization;
    private renameIsland;
}
