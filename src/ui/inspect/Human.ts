import Stream from "@wayward/goodstream/Stream";
import { OwnEventHandler } from "event/EventManager";
import Entity from "game/entity/Entity";
import Human, { REPUTATION_MAX } from "game/entity/Human";
import { IStat, Stat } from "game/entity/IStats";
import { Quality } from "game/IObject";
import { ItemType } from "game/item/IItem";
import Button from "ui/component/Button";
import Component from "ui/component/Component";
import { RangeRow } from "ui/component/RangeRow";
import { Bound } from "utilities/Decorators";
import AddItemToInventory from "../../action/AddItemToInventory";
import ClearInventory from "../../action/ClearInventory";
import SetStat from "../../action/SetStat";
import { DebugToolsTranslation, translation } from "../../IDebugTools";
import AddItemToInventoryComponent from "../component/AddItemToInventory";
import InspectEntityInformationSubsection from "../component/InspectEntityInformationSubsection";

export default class HumanInformation extends InspectEntityInformationSubsection {
	private readonly addItemContainer: Component;
	private readonly reputationSliders: { [key in Stat.Malignity | Stat.Benignity]?: RangeRow } = {};

	private human: Human | undefined;

	public constructor() {
		super();

		this.addItemContainer = new Component().appendTo(this);
		new Button()
			.setText(translation(DebugToolsTranslation.ButtonClearInventory))
			.event.subscribe("activate", () => this.human && ClearInventory.execute(localPlayer, this.human))
			.appendTo(this);

		this.addReputationSlider(DebugToolsTranslation.LabelMalignity, Stat.Malignity);
		this.addReputationSlider(DebugToolsTranslation.LabelBenignity, Stat.Benignity);
	}

	@OwnEventHandler(HumanInformation, "switchTo")
	protected onSwitchTo() {
		const addItemToInventory = AddItemToInventoryComponent.init().appendTo(this.addItemContainer);
		addItemToInventory.event.until(this, "switchAway", "remove")
			.subscribe("execute", this.addItem);
	}

	public override getImmutableStats() {
		return this.human ? [
			Stat.Benignity,
			Stat.Malignity,
			Stat.Attack,
			Stat.Defense,
			Stat.Reputation,
			Stat.Weight,
		] : [];
	}

	public override update(entity: Entity) {
		if (this.human === entity) return;

		this.human = entity.asHuman;
		this.toggle(!!this.human);

		this.event.emit("change");

		if (!this.human) return;

		for (const type of Stream.keys(this.reputationSliders)) {
			this.reputationSliders[type]!.refresh();
		}

		entity.event.until(this, "switchAway")
			.subscribe("statChanged", this.onStatChange);
	}

	private addReputationSlider(labelTranslation: DebugToolsTranslation, type: Stat.Benignity | Stat.Malignity) {
		this.reputationSliders[type] = new RangeRow()
			.setLabel(label => label.setText(translation(labelTranslation)))
			.editRange(range => range
				.setMin(0)
				.setMax(REPUTATION_MAX)
				.setRefreshMethod(() => this.human ? this.human.stat.getValue(type)! : 0))
			.setDisplayValue(true)
			.event.subscribe("finish", this.setReputation(type))
			.appendTo(this);
	}

	private setReputation(type: Stat.Malignity | Stat.Benignity) {
		return (_: any, value: number) => {
			if (this.human!.stat.getValue(type) === value) return;
			SetStat.execute(localPlayer, this.human!, type, value);
		};
	}

	@Bound
	private addItem(_: any, type: ItemType, quality: Quality, quantity: number) {
		if (this.human)
			AddItemToInventory.execute(localPlayer, this.human.asPlayer ?? this.human.inventory, type, quality, quantity);
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
