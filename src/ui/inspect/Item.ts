import ActionExecutor from "entity/action/ActionExecutor";
import { Quality } from "game/IObject";
import { IItem, ItemType } from "item/IItem";
import { Dictionary } from "language/Dictionaries";
import Translation, { TextContext } from "language/Translation";
import Mod from "mod/Mod";
import Button from "newui/component/Button";
import Component from "newui/component/Component";
import { Paragraph } from "newui/component/Text";
import { ITile } from "tile/ITerrain";
import Log from "utilities/Log";
import { IVector2 } from "utilities/math/IVector";
import { Bound } from "utilities/Objects";

import AddItemToInventory from "../../action/AddItemToInventory";
import Remove from "../../action/Remove";
import { DEBUG_TOOLS_ID, DebugToolsTranslation, translation } from "../../IDebugTools";
import { areArraysIdentical } from "../../util/Array";
import AddItemToInventoryComponent from "../component/AddItemToInventory";
import InspectInformationSection, { TabInformation } from "../component/InspectInformationSection";

export default class ItemInformation extends InspectInformationSection {

	@Mod.log(DEBUG_TOOLS_ID)
	public readonly LOG: Log;

	private readonly wrapperAddItem: Component;
	private readonly wrapperItems: Component;

	private items: IItem[] = [];
	private position: IVector2;

	public constructor() {
		super();

		this.wrapperAddItem = new Component().appendTo(this);
		this.wrapperItems = new Component().appendTo(this);
	}

	public getTabs(): TabInformation[] {
		return [
			[0, translation(DebugToolsTranslation.TabItemStack)],
		];
	}

	public setTab() {
		const addItemToInventory = AddItemToInventoryComponent.init().appendTo(this.wrapperAddItem);
		addItemToInventory.event.until(this, "willRemove")
			.subscribe("execute", this.addItem);

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

	public logUpdate() {
		this.LOG.info("Items:", this.items);
	}

	@Bound
	private addItem(_: any, type: ItemType, quality: Quality) {
		ActionExecutor.get(AddItemToInventory).execute(localPlayer, itemManager.getTileContainer(this.position.x, this.position.y, localPlayer.z), type, quality);
	}

	@Bound
	private removeItem(item: IItem) {
		return () => {
			ActionExecutor.get(Remove).execute(localPlayer, item);
		};
	}
}
