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
import { TerrainType } from "@wayward/game/game/tile/ITerrain";
import Component from "@wayward/game/ui/component/Component";
import { IPaintSection } from "../panel/PaintPanel";
export default class TerrainPaint extends Component implements IPaintSection {
    event: IEventEmitter<this, Events<IPaintSection>>;
    private readonly tilledCheckButton;
    private terrain;
    private readonly dropdown;
    constructor();
    getTilePaintData(): {
        terrain: {
            type: TerrainType;
            tilled: boolean;
        };
    } | undefined;
    isChanging(): boolean;
    reset(): void;
    private changeTerrain;
}
