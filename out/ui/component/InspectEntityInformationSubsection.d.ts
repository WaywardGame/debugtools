import { ICreature } from "entity/creature/ICreature";
import { Stat } from "entity/IStats";
import { INPC } from "entity/npc/INPC";
import Player from "entity/player/Player";
import { Events } from "event/EventBuses";
import { IEventEmitter } from "event/EventEmitter";
import Component from "newui/component/Component";
interface IInspectEntityInformationSubsectionEvents extends Events<Component> {
    change(): any;
    switchTo(): any;
    switchAway(): any;
}
export default abstract class InspectEntityInformationSubsection extends Component {
    event: IEventEmitter<this, IInspectEntityInformationSubsectionEvents>;
    constructor();
    abstract update(entity: Player | ICreature | INPC): void;
    getImmutableStats(): Stat[];
}
export {};
