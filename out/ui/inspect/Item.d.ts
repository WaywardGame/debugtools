import Component from "newui/component/Component";
import { UiApi } from "newui/INewUi";
import { ITile } from "tile/ITerrain";
import { IVector2 } from "utilities/math/IVector";
import { IInspectInformationSection } from "../InspectDialog";
export default class ItemInformation extends Component implements IInspectInformationSection {
    constructor(api: UiApi);
    update(position: IVector2, tile: ITile): this;
}
