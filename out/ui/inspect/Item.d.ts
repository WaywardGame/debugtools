import { ITile } from "game/tile/ITerrain";
import Log from "utilities/Log";
import { IVector2 } from "utilities/math/IVector";
import InspectInformationSection, { TabInformation } from "../component/InspectInformationSection";
export default class ItemInformation extends InspectInformationSection {
    readonly LOG: Log;
    private position;
    getTabs(): TabInformation[];
    setTab(): this;
    update(position: IVector2, tile: ITile): void;
    logUpdate(): void;
    private getTile;
}
