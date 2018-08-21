import Component from "newui/component/Component";
import { UiApi } from "newui/INewUi";
import { ITile } from "tile/ITerrain";
import { IVector2 } from "utilities/math/IVector";
import DebugTools from "../../DebugTools";
import { IInspectInformationSection } from "../InspectDialog";

export default class ItemInformation extends Component implements IInspectInformationSection {
	public constructor(api: UiApi) {
		super(api);
	}

	public update(position: IVector2, tile: ITile) {
		const hasItems = tile.containedItems && tile.containedItems.length > 0;
		this.toggle(hasItems);

		if (hasItems) {
			DebugTools.LOG.info("Items:", tile.containedItems);
		}

		return this;
	}
}
