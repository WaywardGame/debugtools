import { ICreature } from "creature/ICreature";
import { REPUTATION_MAX } from "entity/BaseHumanEntity";
import IBaseEntity, { EntityEvent } from "entity/IBaseEntity";
import IBaseHumanEntity from "entity/IBaseHumanEntity";
import { EntityType } from "entity/IEntity";
import { IStat, Stat } from "entity/IStats";
import { ItemQuality, ItemType, SentenceCaseStyle } from "Enums";
import itemDescriptions from "item/Items";
import Translation from "language/Translation";
import Button, { ButtonEvent } from "newui/component/Button";
import Component from "newui/component/Component";
import Dropdown, { DropdownEvent, IDropdownOption } from "newui/component/Dropdown";
import { ComponentEvent, TranslationGenerator } from "newui/component/IComponent";
import { LabelledRow } from "newui/component/LabelledRow";
import { RangeInputEvent } from "newui/component/RangeInput";
import { RangeRow } from "newui/component/RangeRow";
import Text from "newui/component/Text";
import { UiApi } from "newui/INewUi";
import { INPC } from "npc/INPC";
import IPlayer from "player/IPlayer";
import Collectors from "utilities/Collectors";
import Enums from "utilities/enum/Enums";
import Objects, { Bound } from "utilities/Objects";
import Actions from "../../Actions";
import { translation } from "../../DebugTools";
import { DebugToolsTranslation } from "../../IDebugTools";
import InspectEntityInformationSubsection from "../component/InspectEntityInformationSubsection";

export default class HumanInformation extends InspectEntityInformationSubsection {
	private readonly dropdownItemQuality: Dropdown<ItemQuality>;
	private readonly wrapperAddItem: Component;

	private item: ItemType | undefined;
	private human: IBaseHumanEntity | undefined;
	private reputationSliders: { [key in Stat.Malignity | Stat.Benignity]?: RangeRow } = {};

	public constructor(api: UiApi) {
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
			.classes.add("debug-tools-inspect-human-wrapper-add-item")
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
		return this.human ? [
			Stat.Benignity,
			Stat.Malignity,
			Stat.Attack,
			Stat.Defense,
			Stat.Reputation,
			Stat.Weight,
		] : [];
	}

	public update(entity: ICreature | INPC | IPlayer) {
		if (this.human === entity) return;

		this.human = entity.entityType === EntityType.Creature ? undefined : entity;
		this.toggle(!!this.human);

		this.triggerSync("change");

		if (!this.human) return;

		for (const type of Objects.keys(this.reputationSliders)) {
			this.reputationSliders[type]!.refresh();
		}

		this.until([ComponentEvent.Remove, "change"])
			.bind(entity as IBaseEntity, EntityEvent.StatChanged, this.onStatChange);
	}

	private addReputationSlider(labelTranslation: DebugToolsTranslation, type: Stat.Benignity | Stat.Malignity) {
		this.reputationSliders[type] = new RangeRow(this.api)
			.setLabel(label => label.setText(translation(labelTranslation)))
			.editRange(range => range
				.setMin(0)
				.setMax(REPUTATION_MAX)
				.setRefreshMethod(() => this.human ? this.human.getStatValue(type)! : 0))
			.setDisplayValue(true)
			.on(RangeInputEvent.Finish, this.setReputation(type))
			.appendTo(this);
	}

	private setReputation(type: Stat.Malignity | Stat.Benignity) {
		return (_: any, value: number) => {
			if (this.human!.getStatValue(type) === value) return;
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

	@Bound
	private onStatChange(_: any, stat: IStat) {
		switch (stat.type) {
			case Stat.Malignity:
			case Stat.Benignity:
				this.reputationSliders[stat.type]!.refresh();
				break;
		}
	}
}
