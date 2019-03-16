import { ICreature } from "entity/creature/ICreature";
import { Stat } from "entity/IStats";
import { INPC } from "entity/npc/INPC";
import IPlayer from "entity/player/IPlayer";
import Component from "newui/component/Component";

export default abstract class InspectEntityInformationSubsection extends Component {
	public constructor() {
		super();
		this.classes.add("debug-tools-inspect-entity-sub-section");
	}

	public abstract update(entity: IPlayer | ICreature | INPC): void;

	public getImmutableStats(): Stat[] { return []; }
}
