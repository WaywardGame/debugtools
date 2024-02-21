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
import Creature from "@wayward/game/game/entity/creature/Creature";
import NPC from "@wayward/game/game/entity/npc/NPC";
import Player from "@wayward/game/game/entity/player/Player";
import DebugTools from "../../DebugTools";
import InspectEntityInformationSubsection from "../component/InspectEntityInformationSubsection";
export default class PlayerInformation extends InspectEntityInformationSubsection {
    readonly DEBUG_TOOLS: DebugTools;
    private readonly rangeWeightBonus;
    private readonly checkButtonUnkillable;
    private readonly checkButtonNoRender;
    private readonly checkButtonNoClip;
    private readonly skillRangeRow;
    private readonly checkButtonPermissions?;
    private readonly playerToReplaceDataWithDropdown?;
    private readonly buttonExecuteDataReplace;
    private readonly clearNotesButton;
    private skill;
    private player?;
    constructor();
    update(entity: Creature | NPC | Player): void;
    private refresh;
    private changeSkill;
    private setSkill;
    private toggleUnkillable;
    private toggleNoRender;
    private toggleNoClip;
    private togglePermissions;
    private setWeightBonus;
    private onPlayerDataChange;
    private replaceData;
}
