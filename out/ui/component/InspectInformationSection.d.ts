import { Events, IEventEmitter } from "event/EventEmitter";
import { ITile } from "game/tile/ITerrain";
import Component from "ui/component/Component";
import { TranslationGenerator } from "ui/component/IComponent";
import { IVector2 } from "utilities/math/IVector";
export declare type TabInformation = [number, TranslationGenerator];
interface IInspectInformationSectionEvents extends Events<Component> {
    change(): any;
    update(): any;
    switchAway(): any;
    switchTo(): any;
}
export default abstract class InspectInformationSection extends Component {
    event: IEventEmitter<this, IInspectInformationSectionEvents>;
    private shouldLog;
    get willLog(): boolean;
    setTab(tab: number): this;
    setShouldLog(): void;
    resetWillLog(): void;
    abstract getTabs(): TabInformation[];
    abstract update(position: IVector2, tile: ITile): void;
    abstract logUpdate(): void;
}
export {};
