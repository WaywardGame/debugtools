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
import Tile from "@wayward/game/game/tile/Tile";
import Component from "@wayward/game/ui/component/Component";
import { TranslationGenerator } from "@wayward/game/ui/component/IComponent";
import TabDialogPanel from "@wayward/game/ui/screen/screens/game/component/TabDialogPanel";
export type TabInformation = [number, TranslationGenerator];
export interface IInspectInformationSectionEvents extends Events<Component> {
    change(): any;
    update(): any;
    switchAway(): any;
    switchTo(): any;
}
export default abstract class InspectInformationSection extends TabDialogPanel {
    event: IEventEmitter<this, IInspectInformationSectionEvents>;
    private shouldLog;
    get willLog(): boolean;
    setTab(tab: number): this;
    setShouldLog(): void;
    resetWillLog(): void;
    abstract getTabs(): TabInformation[];
    abstract update(tile: Tile): void;
    abstract logUpdate(): void;
}
