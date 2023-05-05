import Tile from "game/tile/Tile";
import Log from "utilities/Log";
import InspectInformationSection, { TabInformation } from "../component/InspectInformationSection";
export default class CorpseInformation extends InspectInformationSection {
    readonly LOG: Log;
    private corpses;
    private corpse;
    constructor();
    getTabs(): TabInformation[];
    setTab(corpse: number): this;
    update(tile: Tile): void;
    logUpdate(): void;
    private resurrect;
    private removeCorpse;
}
