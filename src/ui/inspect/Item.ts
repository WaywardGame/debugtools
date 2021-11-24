import { Quality } from "game/IObject";
import { ItemType } from "game/item/IItem";
import Item from "game/item/Item";
import { ITile } from "game/tile/ITerrain";
import Dictionary from "language/Dictionary";
import { TextContext } from "language/ITranslation";
import Translation from "language/Translation";
import Mod from "mod/Mod";
import Button from "ui/component/Button";
import Component from "ui/component/Component";
import { Paragraph } from "ui/component/Text";
import { Bound } from "utilities/Decorators";
import Log from "utilities/Log";
import { IVector2 } from "utilities/math/IVector";
import AddItemToInventory, { ADD_ITEM_ALL, ADD_ITEM_RANDOM } from "../../action/AddItemToInventory";
import Remove from "../../action/Remove";
import { DebugToolsTranslation, DEBUG_TOOLS_ID, translation } from "../../IDebugTools";
import { areArraysIdentical } from "../../util/Array";
import AddItemToInventoryComponent from "../component/AddItemToInventory";
import InspectInformationSection, { TabInformation } from "../component/InspectInformationSection";


export default class ItemInformation extends InspectInformationSection {

	@Mod.log(DEBUG_TOOLS_ID)
	public readonly LOG: Log;

	private readonly wrapperAddItem: Component;
	private readonly wrapperItems: Component;

	private items: Item[] = [];
	private position: IVector2;

	public constructor() {
		super();

		this.wrapperAddItem = new Component().appendTo(this);
		this.wrapperItems = new Component().appendTo(this);
	}

	public override getTabs(): TabInformation[] {
		return [
			[0, translation(DebugToolsTranslation.TabItemStack)],
		];
	}

	public override setTab() {
		const addItemToInventory = AddItemToInventoryComponent.init().appendTo(this.wrapperAddItem);
		addItemToInventory.event.until(this, "remove", "switchAway")
			.subscribe("execute", this.addItem);

		return this;
	}

	public override update(position: IVector2, tile: ITile) {
		this.position = position;
		const items = [...tile.containedItems || []];

		if (areArraysIdentical(items, this.items)) return;
		this.items = items;
		this.wrapperItems.dump();

		if (!this.items.length) return;

		this.setShouldLog();

		for (const item of this.items) {
			new Paragraph()
				.setText(() => translation(DebugToolsTranslation.ItemName)
					.get(Translation.nameOf(Dictionary.Item, item, true).inContext(TextContext.Title)))
				.appendTo(this.wrapperItems);

			new Button()
				.setText(translation(DebugToolsTranslation.ActionRemove))
				.event.subscribe("activate", this.removeItem(item))
				.appendTo(this.wrapperItems);
		}
	}

	public override logUpdate() {
		this.LOG.info("Items:", this.items);
	}

	@Bound
	private addItem(_: any, type: ItemType | typeof ADD_ITEM_ALL | typeof ADD_ITEM_RANDOM, quality: Quality, quantity: number) {
		AddItemToInventory.execute(localPlayer, localIsland.items.getTileContainer(this.position.x, this.position.y, localPlayer.z), type, quality, quantity);
	}

	@Bound
	private removeItem(item: Item) {
		return () => {
			Remove.execute(localPlayer, item);
		};
	}
}
