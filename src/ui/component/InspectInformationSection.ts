import Component from "newui/component/Component";
import { TranslationGenerator } from "newui/component/IComponent";
import { ITile } from "tile/ITerrain";
import { IVector2 } from "utilities/math/IVector";

export type TabInformation = [number, TranslationGenerator];

export default abstract class InspectInformationSection extends Component {
	public abstract getTabs(): TabInformation[];
	public abstract update(position: IVector2, tile: ITile): void;
	public setTab(tab: number) { return this; }
}
