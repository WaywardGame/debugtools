import { ItemQuality, ItemType } from "Enums";
import { Dictionary } from "language/Dictionaries";
import Translation, { TextContext } from "language/Translation";
import Button, { ButtonEvent } from "newui/component/Button";
import Component from "newui/component/Component";
import Dropdown, { DropdownEvent } from "newui/component/Dropdown";
import { ComponentEvent } from "newui/component/IComponent";
import { LabelledRow } from "newui/component/LabelledRow";
import Text from "newui/component/Text";
import { UiApi } from "newui/INewUi";
import { tuple } from "utilities/Arrays";
import Enums from "utilities/enum/Enums";
import Collectors from "utilities/iterable/Collectors";
import { pipe } from "utilities/iterable/Generators";
import { Bound } from "utilities/Objects";
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

	public static init(api: UiApi) {
		return AddItemToInventory.INSTANCE = AddItemToInventory.INSTANCE || new AddItemToInventory(api);
	}

	private readonly dropdownItemType: Dropdown<ItemType>;
	private readonly dropdownItemQuality: Dropdown<ItemQuality>;
	private readonly wrapperAddItem: Component;

	private constructor(api: UiApi) {
		super(api);

		new LabelledRow(api)
			.classes.add("dropdown-label")
			.setLabel(label => label.setText(translation(DebugToolsTranslation.LabelItem)))
			.append(this.dropdownItemType = new Dropdown<ItemType>(api)
				.setRefreshMethod(() => ({
					defaultOption: ItemType.None,
					options: pipe(tuple(ItemType.None, Translation.nameOf(Dictionary.Item, ItemType.None, false).inContext(TextContext.Title)))
						.include(Enums.values(ItemType)
							.filter(item => item)
							.map(item => tuple(item, Translation.nameOf(Dictionary.Item, item, false).inContext(TextContext.Title)))
							.collect(Collectors.toArray)
							.sort(([, t1], [, t2]) => Text.toString(t1).localeCompare(Text.toString(t2)))
							.values())
						.map(([id, t]) => tuple(id, (option: Button) => option.setText(t))),
				}))
				.on(DropdownEvent.Selection, this.changeItem))
			.appendTo(this);

		this.wrapperAddItem = new Component(api)
			.classes.add("debug-tools-inspect-human-wrapper-add-item")
			.hide()
			.append(new LabelledRow(api)
				.classes.add("dropdown-label")
				.setLabel(label => label.setText(translation(DebugToolsTranslation.LabelQuality)))
				.append(this.dropdownItemQuality = new Dropdown<ItemQuality>(api)
					.setRefreshMethod(() => ({
						defaultOption: ItemQuality.Random,
						options: Enums.values(ItemQuality)
							.map(quality => tuple(quality, Translation.generator(ItemQuality[quality])))
							.collect(Collectors.toArray)
							.values()
							.map(([id, t]) => tuple(id, (option: Button) => option.setText(t))),
					}))))
			.append(new Button(api)
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
		this.trigger(AddItemToInventoryEvent.Execute, this.dropdownItemType.selection, this.dropdownItemQuality.selection);
	}
}
