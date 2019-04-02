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
	@Override public event: ExtendedEvents<this, Component, IInspectEntityInformationSubsectionEvents>;

	public constructor() {
		super();
		this.classes.add("debug-tools-inspect-entity-sub-section");
	}

	public abstract update(entity: IPlayer | ICreature | INPC): void;

	public getImmutableStats(): Stat[] { return []; }
}
