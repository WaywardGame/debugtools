import { ICreature } from "creature/ICreature";
import { Stat } from "entity/IStats";
import Component from "newui/component/Component";
import IGameScreenApi from "newui/screen/screens/game/IGameScreenApi";
import { INPC } from "npc/INPC";
import IPlayer from "player/IPlayer";
export default abstract class InspectEntityInformationSubsection extends Component {
    protected readonly gsapi: IGameScreenApi;
    constructor(gsapi: IGameScreenApi);
    abstract update(entity: IPlayer | ICreature | INPC): void;
    getImmutableStats(): Stat[];
}
