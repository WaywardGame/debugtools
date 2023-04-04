import { Quality } from "game/IObject";
import { IContainer, ItemType } from "game/item/IItem";
import Dictionary from "language/Dictionary";
import Translation from "language/Translation";
import Button from "ui/component/Button";
import Component from "ui/component/Component";
import Dropdown from "ui/component/Dropdown";
import { LabelledRow } from "ui/component/LabelledRow";
import { RangeRow } from "ui/component/RangeRow";
import ItemDropdown from "ui/component/dropdown/ItemDropdown";
import { Bound } from "utilities/Decorators";
import { Tuple } from "utilities/collection/Arrays";
import Enums from "utilities/enum/Enums";
import { DebugToolsTranslation, translation } from "../../IDebugTools";
import AddItemToInventoryAction, { ADD_ITEM_ALL, ADD_ITEM_RANDOM } from "../../action/AddItemToInventory";

export default class AddItemToInventory extends Component {

	public static itemDropdown?: ItemDropdown<"None" | "Random" | "All">;

	private readonly dropdownItemType: ItemDropdown<"None" | "Random" | "All">;
	private readonly dropdownItemQuality: Dropdown<Quality>;
	private readonly rangeItemQuantity: RangeRow;
	private readonly wrapperAddItem: Component;

	public constructor(private readonly containerSupplier: () => IContainer | undefined) {
		super();

		AddItemToInventory.itemDropdown ??= new ItemDropdown("None", [
			["None", option => option.setText(translation(DebugToolsTranslation.None))],
			["Random", option => option.setText(translation(DebugToolsTranslation.MethodRandom))],
			["All", option => option.setText(translation(DebugToolsTranslation.MethodAll))],
		]);

		new LabelledRow()
			.classes.add("dropdown-label")
			.setLabel(label => label.setText(translation(DebugToolsTranslation.LabelItem)))
			.append(this.dropdownItemType = new ItemDropdown("None", [
				["None", option => option.setText(translation(DebugToolsTranslation.None))],
				["Random", option => option.setText(translation(DebugToolsTranslation.MethodRandom))],
				["All", option => option.setText(translation(DebugToolsTranslation.MethodAll))],
			], true)
				.use(AddItemToInventory.itemDropdown)
				.event.subscribe("selection", this.changeItem))
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
							.map(quality => Tuple(quality, Translation.get(Dictionary.Quality, quality)))
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
	private changeItem(_: any, item: ItemType | "None" | "Random" | "All") {
		this.wrapperAddItem.toggle(item !== "None");
		this.rangeItemQuantity.toggle(item !== "All");
	}

	@Bound
	private addItem() {
		const selection = this.dropdownItemType.selection;
		const container = this.containerSupplier();
		if (!container)
			return;

		AddItemToInventoryAction.execute(localPlayer, container,
			selection === "Random" ? ADD_ITEM_RANDOM : selection === "All" ? ADD_ITEM_ALL : selection as ItemType,
			this.dropdownItemQuality.selection,
			Math.floor(1.2 ** this.rangeItemQuantity.value));
	}
}
