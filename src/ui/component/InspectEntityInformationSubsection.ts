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
	public override event: IEventEmitter<this, IInspectEntityInformationSubsectionEvents>;

	public constructor() {
		super();
		this.classes.add("debug-tools-inspect-entity-sub-section");
	}

	public abstract update(entity: Entity): void;

	public getImmutableStats(): Stat[] { return []; }
}
