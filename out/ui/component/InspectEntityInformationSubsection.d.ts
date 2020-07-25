import Entity from "entity/Entity";
import { Stat } from "entity/IStats";
import { Events, IEventEmitter } from "event/EventEmitter";
import Component from "newui/component/Component";
interface IInspectEntityInformationSubsectionEvents extends Events<Component> {
    change(): any;
    switchTo(): any;
    switchAway(): any;
}
export default abstract class InspectEntityInformationSubsection extends Component {
    event: IEventEmitter<this, IInspectEntityInformationSubsectionEvents>;
    constructor();
    abstract update(entity: Entity): void;
    getImmutableStats(): Stat[];
}
export {};
