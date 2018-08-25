import { UiApi } from "newui/INewUi";
import { ITile } from "tile/ITerrain";
import { IVector2 } from "utilities/math/IVector";
import InspectInformationSection, { TabInformation } from "../component/InspectInformationSection";
export default class ItemInformation extends InspectInformationSection {
    private items;
    constructor(api: UiApi);
    getTabs(): TabInformation[];
    update(position: IVector2, tile: ITile): void;
    logUpdate(): void;
}
