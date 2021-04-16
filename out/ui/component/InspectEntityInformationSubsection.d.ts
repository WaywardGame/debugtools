import { Events, IEventEmitter } from "event/EventEmitter";
import Entity from "game/entity/Entity";
import { Stat } from "game/entity/IStats";
import Component from "ui/component/Component";
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
