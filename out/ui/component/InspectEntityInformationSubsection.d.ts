import { ICreature } from "entity/creature/ICreature";
import { Stat } from "entity/IStats";
import { INPC } from "entity/npc/INPC";
import IPlayer from "entity/player/IPlayer";
import { ExtendedEvents } from "event/EventEmitter";
import Component from "newui/component/Component";
interface IInspectEntityInformationSubsectionEvents {
    change(): any;
    switchTo(): any;
    switchAway(): any;
}
export default abstract class InspectEntityInformationSubsection extends Component {
    event: ExtendedEvents<this, Component, IInspectEntityInformationSubsectionEvents>;
    constructor();
    abstract update(entity: IPlayer | ICreature | INPC): void;
    getImmutableStats(): Stat[];
}
export {};
