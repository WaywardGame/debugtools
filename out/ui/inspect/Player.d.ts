import { ICreature } from "entity/creature/ICreature";
import { INPC } from "entity/npc/INPC";
import Player from "entity/player/Player";
import DebugTools from "../../DebugTools";
import InspectEntityInformationSubsection from "../component/InspectEntityInformationSubsection";
export default class PlayerInformation extends InspectEntityInformationSubsection {
    readonly DEBUG_TOOLS: DebugTools;
    private readonly rangeWeightBonus;
    private readonly checkButtonInvulnerable;
    private readonly checkButtonNoClip;
    private readonly skillRangeRow;
    private readonly checkButtonPermissions?;
    private skill?;
    private player?;
    constructor();
    update(entity: ICreature | INPC | Player): void;
    private refresh;
    private changeSkill;
    private setSkill;
    private toggleInvulnerable;
    private toggleNoClip;
    private togglePermissions;
    private setWeightBonus;
    private onPlayerDataChange;
}
