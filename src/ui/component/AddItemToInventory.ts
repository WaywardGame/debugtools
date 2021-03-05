import { Events, IEventEmitter } from "event/EventEmitter";
import { Quality } from "game/IObject";
import { ItemType } from "game/item/IItem";
import Translation from "language/Translation";
import Button from "ui/component/Button";
import Component from "ui/component/Component";
import Dropdown from "ui/component/Dropdown";
import ItemDropdown from "ui/component/dropdown/ItemDropdown";
import { LabelledRow } from "ui/component/LabelledRow";
import { Tuple } from "utilities/collection/Arrays";
import Enums from "utilities/enum/Enums";
import { DebugToolsTranslation, translation } from "../../IDebugTools";

interface IAddItemToInventoryEvents extends Events<Component> {
	/**
	 * @param type The `ItemType` of the item to add
	 * @param quality The `ItemQuality` of the item to add
	 */
	execute(type: ItemType, quality: Quality): any;
}

export default class AddItemToInventory extends Component {
	@Override public event: IEventEmitter<this, IAddItemToInventoryEvents>;

	private static INSTANCE: AddItemToInventory | undefined;

	public static init() {
		return AddItemToInventory.INSTANCE = AddItemToInventory.INSTANCE || new AddItemToInventory();
	}

	private readonly dropdownItemType: ItemDropdown<"None">;
	private readonly dropdownItemQuality: Dropdown<Quality>;
	private readonly wrapperAddItem: Component;

	private constructor() {
		super();

		new LabelledRow()
			.classes.add("dropdown-label")
			.setLabel(label => label.setText(translation(DebugToolsTranslation.LabelItem)))
			.append(this.dropdownItemType = new ItemDropdown("None", [["None", option => option.setText(translation(DebugToolsTranslation.None))]])
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
							.map(quality => Tuple(quality, Translation.generator(Quality[quality])))
							.map(([id, t]) => Tuple(id, (option: Button) => option.setText(t))),
					}))))
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
		this.store();
		return false;
	}

	@Bound
	private changeItem(_: any, item: ItemType | "None") {
		this.wrapperAddItem.toggle(item !== "None");
	}

	@Bound
	private addItem() {
		this.event.emit("execute", this.dropdownItemType.selection as ItemType, this.dropdownItemQuality.selection);
	}
}
