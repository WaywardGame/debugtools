import Creature from "entity/creature/Creature";
import { Stat } from "entity/IStats";
import NPC from "entity/npc/NPC";
import Player from "entity/player/Player";
import { Events } from "event/EventEmitter";
import { IEventEmitter } from "event/EventEmitter";
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

	public abstract update(entity: Player | Creature | NPC): void;

	public getImmutableStats(): Stat[] { return []; }
}
