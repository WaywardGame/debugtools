import { Events, IEventEmitter } from "event/EventEmitter";
import { Quality } from "game/IObject";
import { ItemType } from "game/item/IItem";
import Dictionary from "language/Dictionary";
import Translation from "language/Translation";
import Button from "ui/component/Button";
import Component from "ui/component/Component";
import Dropdown from "ui/component/Dropdown";
import ItemDropdown from "ui/component/dropdown/ItemDropdown";
import { LabelledRow } from "ui/component/LabelledRow";
import { RangeRow } from "ui/component/RangeRow";
import { Tuple } from "utilities/collection/Arrays";
import { Bound } from "utilities/Decorators";
import Enums from "utilities/enum/Enums";
import { ADD_ITEM_ALL, ADD_ITEM_RANDOM } from "../../action/AddItemToInventory";
import { DebugToolsTranslation, translation } from "../../IDebugTools";

interface IAddItemToInventoryEvents extends Events<Component> {
	/**
	 * @param type The `ItemType` of the item to add
	 * @param quality The `ItemQuality` of the item to add
	 */
	execute(type: ItemType | typeof ADD_ITEM_RANDOM | typeof ADD_ITEM_ALL, quality: Quality, quantity: number): any;
}

export default class AddItemToInventory extends Component {
	public override event: IEventEmitter<this, IAddItemToInventoryEvents>;

	public static INSTANCE: AddItemToInventory | undefined;

	public static init() {
		return AddItemToInventory.INSTANCE = AddItemToInventory.INSTANCE || new AddItemToInventory();
	}

	private readonly dropdownItemType: ItemDropdown<"None" | "Random" | "All">;
	private readonly dropdownItemQuality: Dropdown<Quality>;
	private readonly rangeItemQuantity: RangeRow;
	private readonly wrapperAddItem: Component;

	private constructor() {
		super();

		new LabelledRow()
			.classes.add("dropdown-label")
			.setLabel(label => label.setText(translation(DebugToolsTranslation.LabelItem)))
			.append(this.dropdownItemType = new ItemDropdown("None", [
				["None", option => option.setText(translation(DebugToolsTranslation.None))],
				["Random", option => option.setText(translation(DebugToolsTranslation.MethodRandom))],
				["All", option => option.setText(translation(DebugToolsTranslation.MethodAll))],
			])
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

		this.event.subscribe("willRemove", this.willRemove);
	}

	public releaseAndRemove() {
		this.event.unsubscribe("willRemove", this.willRemove);
		this.remove();
		delete AddItemToInventory.INSTANCE;
	}

	@Bound
	private willRemove() {
		this.store(this.getScreen()!);
		return false;
	}

	@Bound
	private changeItem(_: any, item: ItemType | "None" | "Random" | "All") {
		this.wrapperAddItem.toggle(item !== "None");
		this.rangeItemQuantity.toggle(item !== "All");
	}

	@Bound
	private addItem() {
		const selection = this.dropdownItemType.selection;
		this.event.emit("execute",
			selection === "Random" ? ADD_ITEM_RANDOM : selection === "All" ? ADD_ITEM_ALL : selection as ItemType,
			this.dropdownItemQuality.selection,
			Math.floor(1.2 ** this.rangeItemQuantity.value));
	}
}
