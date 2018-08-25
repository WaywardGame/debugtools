import { UiApi } from "newui/INewUi";
import { ITile } from "tile/ITerrain";
import { IVector2 } from "utilities/math/IVector";
import InspectInformationSection, { TabInformation } from "../component/InspectInformationSection";
export default class CorpseInformation extends InspectInformationSection {
    private readonly resurrectButton;
    private corpses;
    private corpse;
    constructor(api: UiApi);
    getTabs(): TabInformation[];
    setTab(corpse: number): this;
    update(position: IVector2, tile: ITile): void;
    logUpdate(): void;
    private resurrect;
    private removeCorpse;
}
