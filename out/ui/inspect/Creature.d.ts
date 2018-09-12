import { ICreature } from "creature/ICreature";
import IGameScreenApi from "newui/screen/screens/game/IGameScreenApi";
import { INPC } from "npc/INPC";
import { IPlayer } from "player/IPlayer";
import InspectEntityInformationSubsection from "../component/InspectEntityInformationSubsection";
export default class CreatureInformation extends InspectEntityInformationSubsection {
    private creature;
    constructor(gsapi: IGameScreenApi);
    update(entity: ICreature | INPC | IPlayer): void;
    private setTamed;
    private removeCreature;
}
