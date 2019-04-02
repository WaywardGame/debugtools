import { ExtendedEvents } from "event/EventEmitter";
import Component from "newui/component/Component";
import { TranslationGenerator } from "newui/component/IComponent";
import { ITile } from "tile/ITerrain";
import { IVector2 } from "utilities/math/IVector";
export declare type TabInformation = [number, TranslationGenerator];
interface IInspectInformationSectionEvents {
    change(): any;
    update(): any;
    switchAway(): any;
    switchTo(): any;
}
export default abstract class InspectInformationSection extends Component {
    event: ExtendedEvents<this, Component, IInspectInformationSectionEvents>;
    private shouldLog;
    readonly willLog: boolean;
    setTab(tab: number): this;
    setShouldLog(): void;
    resetWillLog(): void;
    abstract getTabs(): TabInformation[];
    abstract update(position: IVector2, tile: ITile): void;
    abstract logUpdate(): void;
}
export {};
