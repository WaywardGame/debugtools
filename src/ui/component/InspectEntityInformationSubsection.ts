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
	@Override public event: IEventEmitter<this, IInspectEntityInformationSubsectionEvents>;

	public constructor() {
		super();
		this.classes.add("debug-tools-inspect-entity-sub-section");
	}

	public abstract update(entity: Entity): void;

	public getImmutableStats(): Stat[] { return []; }
}
