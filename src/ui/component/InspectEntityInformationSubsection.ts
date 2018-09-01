import { ICreature } from "creature/ICreature";
import { Stat } from "entity/IStats";
import Component from "newui/component/Component";
import { UiApi } from "newui/INewUi";
import { INPC } from "npc/INPC";
import IPlayer from "player/IPlayer";

export default abstract class InspectEntityInformationSubsection extends Component {
	public constructor(api: UiApi) {
		super(api);
		this.classes.add("debug-tools-inspect-entity-sub-section");
	}

	public abstract update(entity: IPlayer | ICreature | INPC): void;

	public getImmutableStats(): Stat[] { return []; }
}
