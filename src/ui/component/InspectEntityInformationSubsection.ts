import Entity from "@wayward/game/game/entity/Entity";
import { Stat } from "@wayward/game/game/entity/IStats";
import Component from "@wayward/game/ui/component/Component";
import { Events, IEventEmitter } from "@wayward/utilities/event/EventEmitter";

interface IInspectEntityInformationSubsectionEvents extends Events<Component> {
	change(): any;
	switchTo(): any;
	switchAway(): any;
}

export default abstract class InspectEntityInformationSubsection extends Component {
	declare public event: IEventEmitter<this, IInspectEntityInformationSubsectionEvents>;

	public constructor() {
		super();
		this.classes.add("debug-tools-inspect-entity-sub-section");
	}

	public abstract update(entity: Entity): void;

	public getImmutableStats(): Stat[] { return []; }
}
