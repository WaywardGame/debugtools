import { ICreature } from "creature/ICreature";
import { Stat } from "entity/IStats";
import Component from "newui/component/Component";
import { TranslationGenerator } from "newui/component/IComponent";
import { UiApi } from "newui/INewUi";
import { INPC } from "npc/INPC";
import IPlayer from "player/IPlayer";
import { ITile } from "tile/ITerrain";
import { IVector2 } from "utilities/math/IVector";
export declare type TabInformation = [number, TranslationGenerator];
export declare abstract class InspectInformationSection extends Component {
    abstract getTabs(): TabInformation[];
    abstract update(position: IVector2, tile: ITile): void;
    setTab(tab: number): this;
}
export declare abstract class InspectEntityInformationSubsection extends Component {
    constructor(api: UiApi);
    abstract update(entity: IPlayer | ICreature | INPC): void;
    getImmutableStats(): Stat[];
}
