import { UiApi } from "newui/INewUi";
import { ITile } from "tile/ITerrain";
import { IVector2 } from "utilities/math/IVector";
import InspectInformationSection, { TabInformation } from "../component/InspectInformationSection";
export default class ItemInformation extends InspectInformationSection {
    private readonly wrapperItems;
    private items;
    private position;
    constructor(api: UiApi);
    getTabs(): TabInformation[];
    setTab(): this;
    update(position: IVector2, tile: ITile): void;
    logUpdate(): void;
    private addItem;
    private removeItem;
}
