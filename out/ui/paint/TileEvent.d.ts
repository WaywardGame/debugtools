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
import { Events, IEventEmitter } from "event/EventEmitter";
import { TileEventType } from "game/tile/ITileEvent";
import Component from "ui/component/Component";
import { IPaintSection } from "../panel/PaintPanel";
export default class TileEventPaint extends Component implements IPaintSection {
    event: IEventEmitter<this, Events<IPaintSection>>;
    private readonly dropdown;
    private readonly replaceExisting;
    private tileEvent;
    constructor();
    getTilePaintData(): {
        tileEvent: {
            type: TileEventType | "remove" | undefined;
            replaceExisting: boolean;
        };
    };
    isChanging(): boolean;
    reset(): void;
    private changeEvent;
}
