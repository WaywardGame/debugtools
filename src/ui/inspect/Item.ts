import { IItem } from "item/IItem";
import { UiApi } from "newui/INewUi";
import { ITile } from "tile/ITerrain";
import { IVector2 } from "utilities/math/IVector";
import DebugTools, { translation } from "../../DebugTools";
import { DebugToolsTranslation } from "../../IDebugTools";
import { areArraysIdentical } from "../../util/Array";
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
		const items = tile.containedItems || [];

		if (areArraysIdentical(items, this.items)) return;
		this.items = items;

		if (!this.items.length) return;

		this.setShouldLog();
	}

	public logUpdate() {
		DebugTools.LOG.info("Items:", this.items);
	}
}
