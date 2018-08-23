import { IItem } from "item/IItem";
import { UiApi } from "newui/INewUi";
import { ITile } from "tile/ITerrain";
import { IVector2 } from "utilities/math/IVector";
import DebugTools, { translation } from "../../DebugTools";
import { DebugToolsTranslation } from "../../IDebugTools";
import InspectInformationSection, { TabInformation } from "../component/InspectInformationSection";

export default class ItemInformation extends InspectInformationSection {
	private items: IItem[] = [];

	public constructor(api: UiApi) {
		super(api);
	}

	public getTabs(): TabInformation[] {
		return this.items.length ? [
			[0, translation(DebugToolsTranslation.TabItemStack)],
		] : [];
	}

	public update(position: IVector2, tile: ITile) {
		this.items = tile.containedItems || [];

		if (this.items.length) {
			DebugTools.LOG.info("Items:", tile.containedItems);
		}

		return this;
	}
}
