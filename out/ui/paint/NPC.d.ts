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
import { Events, IEventEmitter } from "@wayward/utilities/event/EventEmitter";
import { NPCType } from "@wayward/game/game/entity/npc/INPCs";
import Component from "@wayward/game/ui/component/Component";
import { IPaintSection } from "../panel/PaintPanel";
export default class NPCPaint extends Component implements IPaintSection {
    event: IEventEmitter<this, Events<IPaintSection>>;
    private readonly dropdown;
    private npc;
    constructor();
    getTilePaintData(): {
        npc: {
            type: NPCType | "remove";
        };
    } | undefined;
    isChanging(): boolean;
    reset(): void;
    private changeNPC;
}
