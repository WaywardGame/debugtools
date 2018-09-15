import { ICreature } from "creature/ICreature";
import { Stat } from "entity/IStats";
import Component from "newui/component/Component";
import IGameScreenApi from "newui/screen/screens/game/IGameScreenApi";
import { INPC } from "npc/INPC";
import IPlayer from "player/IPlayer";

export default abstract class InspectEntityInformationSubsection extends Component {
	public constructor(protected readonly gsapi: IGameScreenApi) {
		super(gsapi.uiApi);
		this.classes.add("debug-tools-inspect-entity-sub-section");
	}

	public abstract update(entity: IPlayer | ICreature | INPC): void;

	public getImmutableStats(): Stat[] { return []; }
}
