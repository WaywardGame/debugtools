import { ItemQuality, ItemType, SentenceCaseStyle } from "Enums";
import { IItem } from "item/IItem";
import Translation from "language/Translation";
import Button, { ButtonEvent } from "newui/component/Button";
import Component from "newui/component/Component";
import { ComponentEvent } from "newui/component/IComponent";
import { Paragraph } from "newui/component/Text";
import { UiApi } from "newui/INewUi";
import { ITile } from "tile/ITerrain";
import { IVector2 } from "utilities/math/IVector";
import { Bound } from "utilities/Objects";
import Actions from "../../Actions";
import DebugTools, { translation } from "../../DebugTools";
import { DebugToolsTranslation } from "../../IDebugTools";
import { areArraysIdentical } from "../../util/Array";
import AddItemToInventory, { AddItemToInventoryEvent } from "../component/AddItemToInventory";
import InspectInformationSection, { TabInformation } from "../component/InspectInformationSection";

export default class ItemInformation extends InspectInformationSection {
	private readonly wrapperItems: Component;

	private items: IItem[] = [];
	private position: IVector2;

	public constructor(api: UiApi) {
		super(api);

		this.wrapperItems = new Component(this.api).appendTo(this);
	}

	public getTabs(): TabInformation[] {
		return [
			[0, translation(DebugToolsTranslation.TabItemStack)],
		];
	}

	public setTab() {
		const addItemToInventory = AddItemToInventory.get(this.api).appendTo(this);
		this.until(ComponentEvent.WillRemove)
			.bind(addItemToInventory, AddItemToInventoryEvent.Execute, this.addItem);

		return this;
	}

	public update(position: IVector2, tile: ITile) {
		this.position = position;
		const items = [...tile.containedItems || []];

		if (areArraysIdentical(items, this.items)) return;
		this.items = items;
		this.wrapperItems.dump();

		if (!this.items.length) return;

		this.setShouldLog();

		for (const item of this.items) {
			new Paragraph(this.api)
				.setText(() => translation(DebugToolsTranslation.ItemName)
					.get(Translation.ofObjectName(item, SentenceCaseStyle.Title, true)))
				.appendTo(this.wrapperItems);

			new Button(this.api)
				.setText(translation(DebugToolsTranslation.ActionRemove))
				.on(ButtonEvent.Activate, this.removeItem(item))
				.appendTo(this.wrapperItems);
		}
	}

	public logUpdate() {
		DebugTools.LOG.info("Items:", this.items);
	}

	@Bound
	private addItem(_: any, type: ItemType, quality: ItemQuality) {
		Actions.get("addItemToInventory")
			.execute({ point: this.position, object: [type, quality] });
	}

	@Bound
	private removeItem(item: IItem) {
		return () => {
			Actions.get("removeItem").execute({ item });
		};
	}
}
