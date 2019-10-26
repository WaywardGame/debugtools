import { ITile } from "tile/ITerrain";
import Log from "utilities/Log";
import { IVector2 } from "utilities/math/IVector";
import InspectInformationSection, { TabInformation } from "../component/InspectInformationSection";
export default class CorpseInformation extends InspectInformationSection {
    readonly LOG: Log;
    private corpses;
    private corpse;
    constructor();
    getTabs(): TabInformation[];
    setTab(corpse: number): this;
    update(position: IVector2, tile: ITile): void;
    logUpdate(): void;
    private resurrect;
    private removeCorpse;
}
