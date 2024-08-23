/*!
 * Copyright 2011-2024 Unlok
 * https://www.unlok.ca
 *
 * Credits & Thanks:
 * https://www.unlok.ca/credits-thanks/
 *
 * Wayward is a copyrighted and licensed work. Modification and/or distribution of any source files is prohibited. If you wish to modify the game in any way, please refer to the modding guide:
 * https://github.com/WaywardGame/types/wiki
 */

import { Quality } from "@wayward/game/game/IObject";
import { IContainer, ItemType } from "@wayward/game/game/item/IItem";
import Dictionary from "@wayward/game/language/Dictionary";
import { TextContext } from "@wayward/game/language/ITranslation";
import Translation from "@wayward/game/language/Translation";
import Button from "@wayward/game/ui/component/Button";
import Component from "@wayward/game/ui/component/Component";
import Dropdown from "@wayward/game/ui/component/Dropdown";
import { LabelledRow } from "@wayward/game/ui/component/LabelledRow";
import { RangeRow } from "@wayward/game/ui/component/RangeRow";
import ItemDropdown from "@wayward/game/ui/component/dropdown/ItemDropdown";
import Enums from "@wayward/game/utilities/enum/Enums";
import { Bound } from "@wayward/utilities/Decorators";
import { Tuple } from "@wayward/utilities/collection/Tuple";
import { DebugToolsTranslation, translation } from "../../IDebugTools";
import AddItemToInventoryAction, { ADD_ITEM_ALL, ADD_ITEM_RANDOM } from "../../action/AddItemToInventory";

export default class AddItemToInventory extends Component {

	public static itemDropdown?: ItemDropdown<"None" | "Random" | "All">;

	private static initItemDropdown(): ItemDropdown<"None" | "Random" | "All"> {
		const itemDropdown = new ItemDropdown("None", [
			["None", option => option.setText(translation(DebugToolsTranslation.None))],
			["Random", option => option.setText(translation(DebugToolsTranslation.MethodRandom))],
			["All", option => option.setText(translation(DebugToolsTranslation.MethodAll))],
		]);

		game.event.subscribeNext("stoppingPlayPostSave", () => {
			itemDropdown.remove();
			delete AddItemToInventory.itemDropdown;
		});

		return itemDropdown;
	}

	private readonly dropdownItemType: ItemDropdown<"None" | "Random" | "All">;
	private readonly dropdownItemQuality: Dropdown<Quality>;
	private readonly rangeItemQuantity: RangeRow;
	private readonly wrapperAddItem: Component;

	public constructor(private readonly containerSupplier: () => IContainer | undefined) {
		super();

		AddItemToInventory.itemDropdown ??= AddItemToInventory.initItemDropdown();

		new LabelledRow()
			.classes.add("dropdown-label")
			.setLabel(label => label.setText(translation(DebugToolsTranslation.LabelItem)))
			.append(this.dropdownItemType = new ItemDropdown("None", [
				["None", option => option.setText(translation(DebugToolsTranslation.None))],
				["Random", option => option.setText(translation(DebugToolsTranslation.MethodRandom))],
				["All", option => option.setText(translation(DebugToolsTranslation.MethodAll))],
			], true)
				.use(AddItemToInventory.itemDropdown)
				.event.subscribe("selection", this.changeItem)
				.event.subscribe("usingSearch", this.usingSearch)
				.setSearchValidOption())
			.appendTo(this);

		this.wrapperAddItem = new Component()
			.classes.add("debug-tools-inspect-human-wrapper-add-item")
			.hide()
			.append(new LabelledRow()
				.classes.add("dropdown-label")
				.setLabel(label => label.setText(translation(DebugToolsTranslation.LabelQuality)))
				.append(this.dropdownItemQuality = new Dropdown<Quality>()
					.setRefreshMethod(() => ({
						defaultOption: Quality.Random,
						options: Enums.values(Quality)
							.map(quality => Tuple(quality, Translation.get(Dictionary.Quality, quality).inContext(TextContext.Title)))
							.map(([id, t]) => Tuple(id, (option: Button) => option.setText(t))),
					}))))
			.append(this.rangeItemQuantity = new RangeRow()
				.classes.add("debug-tools-dialog-add-item-quantity")
				.setLabel(label => label.setText(translation(DebugToolsTranslation.LabelQuantity)))
				.editRange(range => range
					.setMax(40)
					.setStep(0.01))
				.setDisplayValue(value => [{ content: `${Math.floor(1.2 ** value)}` }]))
			.append(new Button()
				.setText(translation(DebugToolsTranslation.AddToInventory))
				.event.subscribe("activate", this.addItem))
			.appendTo(this);
	}

	@Bound
	private changeItem(_: any, item: ItemType | "None" | "Random" | "All" | "search"): void {
		this.wrapperAddItem.toggle(item !== "None");
	}

	@Bound
	private usingSearch(): void {
		this.changeItem(undefined, "search");
	}

	@Bound
	private addItem(): void {
		const selection = this.dropdownItemType.selection;
		const container = this.containerSupplier();
		if (!container)
			return;

		AddItemToInventoryAction.execute(localPlayer, container,
			selection === "Random" ? ADD_ITEM_RANDOM : selection === "All" ? ADD_ITEM_ALL : typeof selection === "object" ? selection.matching : selection,
			this.dropdownItemQuality.selectedOption,
			Math.floor(1.2 ** this.rangeItemQuantity.value));
	}
}
