import { REPUTATION_MAX } from "entity/BaseHumanEntity";
import IBaseHumanEntity from "entity/IBaseHumanEntity";
import { Stat } from "entity/IStats";
import { ItemQuality, ItemType, SentenceCaseStyle } from "Enums";
import itemDescriptions from "item/Items";
import Translation from "language/Translation";
import Button, { ButtonEvent } from "newui/component/Button";
import Component from "newui/component/Component";
import Dropdown, { DropdownEvent, IDropdownOption } from "newui/component/Dropdown";
import { TranslationGenerator } from "newui/component/IComponent";
import { LabelledRow } from "newui/component/LabelledRow";
import { RangeInputEvent } from "newui/component/RangeInput";
import { RangeRow } from "newui/component/RangeRow";
import Text from "newui/component/Text";
import { UiApi } from "newui/INewUi";
import { INPC } from "npc/INPC";
import IPlayer from "player/IPlayer";
import Collectors from "utilities/Collectors";
import Enums from "utilities/enum/Enums";
import { Bound } from "utilities/Objects";
import Actions from "../../Actions";
import { translation } from "../../DebugTools";
import { DebugToolsTranslation } from "../../IDebugTools";
import { IInspectEntityInformationSubsection } from "./Entity";

export default class HumanInformation extends Component implements IInspectEntityInformationSubsection {
	private readonly dropdownItemQuality: Dropdown<ItemQuality>;
	private readonly wrapperAddItem: Component;
	private item: ItemType | undefined;

	public constructor(api: UiApi, private readonly human: IBaseHumanEntity) {
		super(api);

		new LabelledRow(api)
			.classes.add("dropdown-label")
			.setLabel(label => label.setText(translation(DebugToolsTranslation.LabelItem)))
			.append(new Dropdown<ItemType>(api)
				.setRefreshMethod(() => ({
					defaultOption: ItemType.None,
					options: Enums.values(ItemType)
						.map<[ItemType, TranslationGenerator]>(item => [item, Translation.ofObjectName(itemDescriptions[item]!, SentenceCaseStyle.Title, false)])
						.collect(Collectors.toArray)
						.sort(([, t1], [, t2]) => Text.toString(t1).localeCompare(Text.toString(t2)))
						.values()
						.map<IDropdownOption<ItemType>>(([id, t]) => [id, option => option.setText(t)]),
				}))
				.on(DropdownEvent.Selection, this.changeItem))
			.appendTo(this);

		this.wrapperAddItem = new Component(api)
			.hide()
			.append(new LabelledRow(api)
				.classes.add("dropdown-label")
				.setLabel(label => label.setText(translation(DebugToolsTranslation.LabelQuality)))
				.append(this.dropdownItemQuality = new Dropdown<ItemQuality>(api)
					.setRefreshMethod(() => ({
						defaultOption: ItemQuality.Random,
						options: Enums.values(ItemQuality)
							.map<[ItemQuality, TranslationGenerator]>(quality => [quality, Translation.generator(ItemQuality[quality])])
							.collect(Collectors.toArray)
							.values()
							.map<IDropdownOption<ItemQuality>>(([id, t]) => [id, option => option.setText(t)]),
					}))))
			.append(new Button(api)
				.setText(translation(DebugToolsTranslation.AddToInventory))
				.on(ButtonEvent.Activate, this.addItem))
			.appendTo(this);

		this.addReputationSlider(DebugToolsTranslation.LabelMalignity, Stat.Malignity);
		this.addReputationSlider(DebugToolsTranslation.LabelBenignity, Stat.Benignity);
	}

	public getImmutableStats() {
		return [
			Stat.Benignity,
			Stat.Malignity,
		];
	}

	private addReputationSlider(labelTranslation: DebugToolsTranslation, type: Stat.Benignity | Stat.Malignity) {
		new RangeRow(this.api)
			.setLabel(label => label.setText(translation(labelTranslation)))
			.editRange(range => range
				.setMin(0)
				.setMax(REPUTATION_MAX)
				.setRefreshMethod(() => this.human.getStatValue(type)!))
			.setDisplayValue(true)
			.on(RangeInputEvent.Finish, this.setReputation(type))
			.appendTo(this);
	}

	private setReputation(type: Stat.Malignity | Stat.Benignity) {
		return (_: any, value: number) => {
			Actions.get("setStat").execute({ entity: this.human as INPC | IPlayer, object: [type, value] });
		};
	}

	@Bound
	private changeItem(_: any, item: ItemType) {
		this.item = item;
		this.wrapperAddItem.toggle(item !== ItemType.None);
	}

	@Bound
	private addItem() {
		Actions.get("addItemToInventory")
			.execute({ human: this.human, object: [this.item!, this.dropdownItemQuality.selection] });
	}
}
