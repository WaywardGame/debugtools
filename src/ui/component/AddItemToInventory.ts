import { Quality } from "game/IObject";
import { ItemType } from "item/IItem";
import { Dictionary } from "language/Dictionaries";
import Translation, { TextContext } from "language/Translation";
import Button, { ButtonEvent } from "newui/component/Button";
import Component from "newui/component/Component";
import Dropdown, { DropdownEvent } from "newui/component/Dropdown";
import { ComponentEvent } from "newui/component/IComponent";
import { LabelledRow } from "newui/component/LabelledRow";
import Text from "newui/component/Text";
import { tuple } from "utilities/Arrays";
import Enums from "utilities/enum/Enums";
import { Bound } from "utilities/Objects";
import Stream from "utilities/stream/Stream";
import { DebugToolsTranslation, translation } from "../../IDebugTools";

export enum AddItemToInventoryEvent {
	/**
	 * @param type The `ItemType` of the item to add
	 * @param quality The `ItemQuality` of the item to add
	 */
	Execute = "Execute",
}

export default class AddItemToInventory extends Component {

	private static INSTANCE: AddItemToInventory | undefined;

	public static init() {
		return AddItemToInventory.INSTANCE = AddItemToInventory.INSTANCE || new AddItemToInventory();
	}

	private readonly dropdownItemType: Dropdown<ItemType>;
	private readonly dropdownItemQuality: Dropdown<Quality>;
	private readonly wrapperAddItem: Component;

	private constructor() {
		super();

		new LabelledRow()
			.classes.add("dropdown-label")
			.setLabel(label => label.setText(translation(DebugToolsTranslation.LabelItem)))
			.append(this.dropdownItemType = new Dropdown<ItemType>()
				.setRefreshMethod(() => ({
					defaultOption: ItemType.None,
					options: Stream.of(tuple(ItemType.None, Translation.nameOf(Dictionary.Item, ItemType.None, false).inContext(TextContext.Title)))
						.merge(Enums.values(ItemType)
							.filter(item => item)
							.map(item => tuple(item, Translation.nameOf(Dictionary.Item, item, false).inContext(TextContext.Title)))
							.sorted(([, t1], [, t2]) => Text.toString(t1).localeCompare(Text.toString(t2))))
						.map(([id, t]) => tuple(id, (option: Button) => option.setText(t))),
				}))
				.on(DropdownEvent.Selection, this.changeItem))
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
							.map(quality => tuple(quality, Translation.generator(Quality[quality])))
							.map(([id, t]) => tuple(id, (option: Button) => option.setText(t))),
					}))))
			.append(new Button()
				.setText(translation(DebugToolsTranslation.AddToInventory))
				.on(ButtonEvent.Activate, this.addItem))
			.appendTo(this);

		this.on(ComponentEvent.WillRemove, this.willRemove);
	}

	public releaseAndRemove() {
		this.cancel(ComponentEvent.WillRemove, this.willRemove);
		this.remove();
		delete AddItemToInventory.INSTANCE;
	}

	@Bound
	private willRemove() {
		this.store();
		return false;
	}

	@Bound
	private changeItem(_: any, item: ItemType) {
		this.wrapperAddItem.toggle(item !== ItemType.None);
	}

	@Bound
	private addItem() {
		this.emit(AddItemToInventoryEvent.Execute, this.dropdownItemType.selection, this.dropdownItemQuality.selection);
	}
}
