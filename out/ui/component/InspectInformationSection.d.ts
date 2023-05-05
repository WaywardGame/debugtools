import { Events, IEventEmitter } from "event/EventEmitter";
import Tile from "game/tile/Tile";
import Component from "ui/component/Component";
import { TranslationGenerator } from "ui/component/IComponent";
import TabDialogPanel from "ui/screen/screens/game/component/TabDialogPanel";
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
