import Component from "newui/component/Component";
import { TranslationGenerator } from "newui/component/IComponent";
import { ITile } from "tile/ITerrain";
import { IVector2 } from "utilities/math/IVector";
export declare type TabInformation = [number, TranslationGenerator];
export default abstract class InspectInformationSection extends Component {
    abstract getTabs(): TabInformation[];
    abstract update(position: IVector2, tile: ITile): void;
    setTab(tab: number): this;
}
