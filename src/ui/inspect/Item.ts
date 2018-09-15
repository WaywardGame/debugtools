import { ItemQuality, ItemType, SentenceCaseStyle } from "Enums";
import { IItem } from "item/IItem";
import Translation from "language/Translation";
import Mod from "mod/Mod";
import Button, { ButtonEvent } from "newui/component/Button";
import Component from "newui/component/Component";
import { ComponentEvent } from "newui/component/IComponent";
import { Paragraph } from "newui/component/Text";
import IGameScreenApi from "newui/screen/screens/game/IGameScreenApi";
import { ITile } from "tile/ITerrain";
import Log from "utilities/Log";
import { IVector2 } from "utilities/math/IVector";
import { Bound } from "utilities/Objects";
import Actions from "../../Actions";
import { DEBUG_TOOLS_ID, DebugToolsTranslation, translation } from "../../IDebugTools";
import { areArraysIdentical } from "../../util/Array";
import AddItemToInventory, { AddItemToInventoryEvent } from "../component/AddItemToInventory";
import InspectInformationSection, { TabInformation } from "../component/InspectInformationSection";

export default class ItemInformation extends InspectInformationSection {

	@Mod.log(DEBUG_TOOLS_ID)
	public readonly LOG: Log;

	private readonly wrapperAddItem: Component;
	private readonly wrapperItems: Component;

	private items: IItem[] = [];
	private position: IVector2;

	public constructor(gsapi: IGameScreenApi) {
		super(gsapi);

		this.wrapperAddItem = new Component(this.api).appendTo(this);
		this.wrapperItems = new Component(this.api).appendTo(this);
	}

	public getTabs(): TabInformation[] {
		return [
			[0, translation(DebugToolsTranslation.TabItemStack)],
		];
	}

	public setTab() {
		const addItemToInventory = AddItemToInventory.get(this.api).appendTo(this.wrapperAddItem);
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
		this.LOG.info("Items:", this.items);
	}

	@Bound
	private addItem(_: any, type: ItemType, quality: ItemQuality) {
		Actions.get("addItemToInventory")
			.execute({ point: this.position, object: [type, quality] });
	}

	@Bound
	private removeItem(item: IItem) {
		return () => {
			Actions.get("remove").execute({ item });
		};
	}
}
