import ActionExecutor from "entity/action/ActionExecutor";
import { ICreature } from "entity/creature/ICreature";
import Entity from "entity/Entity";
import { REPUTATION_MAX } from "entity/Human";
import IEntity, { EntityType } from "entity/IEntity";
import { IStat, Stat } from "entity/IStats";
import { INPC } from "entity/npc/INPC";
import IPlayer from "entity/player/IPlayer";
import { EventHandler } from "event/EventManager";
import { Quality } from "game/IObject";
import { ItemType } from "item/IItem";
import Component from "newui/component/Component";
import { RangeRow } from "newui/component/RangeRow";
import { Bound } from "utilities/Objects";
import Stream from "utilities/stream/Stream";

import AddItemToInventory from "../../action/AddItemToInventory";
import SetStat from "../../action/SetStat";
import { DebugToolsTranslation, translation } from "../../IDebugTools";
import AddItemToInventoryComponent from "../component/AddItemToInventory";
import InspectEntityInformationSubsection from "../component/InspectEntityInformationSubsection";

export default class HumanInformation extends InspectEntityInformationSubsection {
	private readonly addItemContainer: Component;
	private readonly reputationSliders: { [key in Stat.Malignity | Stat.Benignity]?: RangeRow } = {};

	private human: IPlayer | INPC | undefined;

	public constructor() {
		super();

		this.addItemContainer = new Component().appendTo(this);

		this.addReputationSlider(DebugToolsTranslation.LabelMalignity, Stat.Malignity);
		this.addReputationSlider(DebugToolsTranslation.LabelBenignity, Stat.Benignity);
	}

	@EventHandler<HumanInformation>("self")("switchTo")
	protected onSwitchTo() {
		const addItemToInventory = AddItemToInventoryComponent.init().appendTo(this.addItemContainer);
		addItemToInventory.event.until(this, "switchAway")
			.subscribe("execute", this.addItem);
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

		this.human = Entity.is(entity, EntityType.Creature) ? undefined : entity;
		this.toggle(!!this.human);

		this.event.emit("change");

		if (!this.human) return;

		for (const type of Stream.keys(this.reputationSliders)) {
			this.reputationSliders[type]!.refresh();
		}

		(entity as IEntity).event.until(this, "switchAway")
			.subscribe("statChanged", this.onStatChange);
	}

	private addReputationSlider(labelTranslation: DebugToolsTranslation, type: Stat.Benignity | Stat.Malignity) {
		this.reputationSliders[type] = new RangeRow()
			.setLabel(label => label.setText(translation(labelTranslation)))
			.editRange(range => range
				.setMin(0)
				.setMax(REPUTATION_MAX)
				.setRefreshMethod(() => this.human ? this.human.getStatValue(type)! : 0))
			.setDisplayValue(true)
			.event.subscribe("finish", this.setReputation(type))
			.appendTo(this);
	}

	private setReputation(type: Stat.Malignity | Stat.Benignity) {
		return (_: any, value: number) => {
			if (this.human!.getStatValue(type) === value) return;
			ActionExecutor.get(SetStat).execute(localPlayer, this.human!, type, value);
		};
	}

	@Bound
	private addItem(_: any, type: ItemType, quality: Quality) {
		ActionExecutor.get(AddItemToInventory).execute(localPlayer, Entity.is(this.human, EntityType.Player) ? this.human : this.human!.inventory, type, quality);
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
