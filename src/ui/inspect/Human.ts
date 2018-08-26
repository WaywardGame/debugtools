import { ICreature } from "creature/ICreature";
import { REPUTATION_MAX } from "entity/BaseHumanEntity";
import IBaseEntity, { EntityEvent } from "entity/IBaseEntity";
import IBaseHumanEntity from "entity/IBaseHumanEntity";
import { EntityType } from "entity/IEntity";
import { IStat, Stat } from "entity/IStats";
import { ItemQuality, ItemType } from "Enums";
import Component from "newui/component/Component";
import { ComponentEvent } from "newui/component/IComponent";
import { RangeInputEvent } from "newui/component/RangeInput";
import { RangeRow } from "newui/component/RangeRow";
import { UiApi } from "newui/INewUi";
import { INPC } from "npc/INPC";
import IPlayer from "player/IPlayer";
import Objects, { Bound } from "utilities/Objects";
import Actions from "../../Actions";
import { translation } from "../../DebugTools";
import { DebugToolsTranslation } from "../../IDebugTools";
import AddItemToInventory, { AddItemToInventoryEvent } from "../component/AddItemToInventory";
import { DebugToolsPanelEvent } from "../component/DebugToolsPanel";
import InspectEntityInformationSubsection from "../component/InspectEntityInformationSubsection";

export default class HumanInformation extends InspectEntityInformationSubsection {
	private readonly addItemContainer: Component;
	private readonly reputationSliders: { [key in Stat.Malignity | Stat.Benignity]?: RangeRow } = {};

	private human: IBaseHumanEntity | undefined;

	public constructor(api: UiApi) {
		super(api);

		this.addItemContainer = new Component(api).appendTo(this);

		this.addReputationSlider(DebugToolsTranslation.LabelMalignity, Stat.Malignity);
		this.addReputationSlider(DebugToolsTranslation.LabelBenignity, Stat.Benignity);

		this.on(DebugToolsPanelEvent.SwitchTo, () => {
			const addItemToInventory = AddItemToInventory.get(this.api).appendTo(this.addItemContainer);
			this.until(DebugToolsPanelEvent.SwitchAway)
				.bind(addItemToInventory, AddItemToInventoryEvent.Execute, this.addItem);
		});
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
	private addItem(_: any, type: ItemType, quality: ItemQuality) {
		Actions.get("addItemToInventory")
			.execute({ human: this.human, object: [type, quality] });
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
