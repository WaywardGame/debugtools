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
import Entity from "game/entity/Entity";
import { Stat } from "game/entity/IStats";
import InspectEntityInformationSubsection from "../component/InspectEntityInformationSubsection";
export default class HumanInformation extends InspectEntityInformationSubsection {
    private readonly addItemContainer;
    private readonly reputationSliders;
    private readonly statusCheckButtons;
    private human;
    constructor();
    protected onSwitchTo(): void;
    getImmutableStats(): Stat[];
    update(entity: Entity): void;
    private addReputationSlider;
    private setReputation;
    private onStatChange;
    private onStatusChange;
}
