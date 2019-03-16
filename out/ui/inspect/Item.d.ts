import { ITile } from "tile/ITerrain";
import Log from "utilities/Log";
import { IVector2 } from "utilities/math/IVector";
import InspectInformationSection, { TabInformation } from "../component/InspectInformationSection";
export default class ItemInformation extends InspectInformationSection {
    readonly LOG: Log;
    private readonly wrapperAddItem;
    private readonly wrapperItems;
    private items;
    private position;
    constructor();
    getTabs(): TabInformation[];
    setTab(): this;
    update(position: IVector2, tile: ITile): void;
    logUpdate(): void;
    private addItem;
    private removeItem;
}
