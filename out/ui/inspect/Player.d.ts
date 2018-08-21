import { Stat } from "entity/IStats";
import { UiApi } from "newui/INewUi";
import IPlayer from "player/IPlayer";
import HumanInformation from "./Human";
export default class PlayerInformation extends HumanInformation {
    private readonly player;
    private readonly rangeWeightBonus;
    private readonly checkButtonInvulnerable;
    private readonly checkButtonNoClip;
    private readonly skillRangeRow;
    private skill;
    constructor(api: UiApi, player: IPlayer);
    getImmutableStats(): Stat[];
    private changeSkill;
    private setSkill;
    private toggleInvulnerable;
    private toggleNoClip;
    private setWeightBonus;
    private onPlayerDataChange;
}
