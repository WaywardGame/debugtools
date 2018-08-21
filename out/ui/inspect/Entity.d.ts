import { Stat } from "entity/IStats";
import Component from "newui/component/Component";
import { UiApi } from "newui/INewUi";
import { ITile } from "tile/ITerrain";
import { IVector2 } from "utilities/math/IVector";
import { IInspectInformationSection } from "../InspectDialog";
export interface IInspectEntityInformationSubsection extends Component {
    getImmutableStats(): Stat[];
}
export default class EntityInformation extends Component implements IInspectInformationSection {
    private entities;
    private statComponents;
    constructor(api: UiApi);
    update(position: IVector2, tile: ITile): this | undefined;
    private addEntityDisplay;
    private onStatChange;
    private kill;
    private cloneEntity;
    private openTeleportMenu;
    private createTeleportToPlayerMenu;
    private selectTeleportLocation;
    private teleport;
    private heal;
    private setStat;
}
