import { ICreature } from "creature/ICreature";
import { UiApi } from "newui/INewUi";
import { INPC } from "npc/INPC";
import IPlayer from "player/IPlayer";
import InspectEntityInformationSubsection from "../component/InspectEntityInformationSubsection";
export default class PlayerInformation extends InspectEntityInformationSubsection {
    private readonly rangeWeightBonus;
    private readonly checkButtonInvulnerable;
    private readonly checkButtonNoClip;
    private readonly skillRangeRow;
    private skill;
    private player;
    constructor(api: UiApi);
    update(entity: ICreature | INPC | IPlayer): void;
    private refresh;
    private changeSkill;
    private setSkill;
    private toggleInvulnerable;
    private toggleNoClip;
    private setWeightBonus;
    private onPlayerDataChange;
}
