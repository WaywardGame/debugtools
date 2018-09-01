import { ICreature } from "creature/ICreature";
import { Stat } from "entity/IStats";
import Component from "newui/component/Component";
import { UiApi } from "newui/INewUi";
import { INPC } from "npc/INPC";
import IPlayer from "player/IPlayer";
export default abstract class InspectEntityInformationSubsection extends Component {
    constructor(api: UiApi);
    abstract update(entity: IPlayer | ICreature | INPC): void;
    getImmutableStats(): Stat[];
}
