import ActionExecutor from "action/ActionExecutor";
import { ICreature } from "creature/ICreature";
import Entity from "entity/Entity";
import { REPUTATION_MAX } from "entity/Human";
import IEntity, { EntityEvent, EntityType } from "entity/IEntity";
import { IStat, Stat } from "entity/IStats";
import { ItemQuality, ItemType } from "Enums";
import Component from "newui/component/Component";
import { ComponentEvent } from "newui/component/IComponent";
import { RangeInputEvent } from "newui/component/RangeInput";
import { RangeRow } from "newui/component/RangeRow";
import IGameScreenApi from "newui/screen/screens/game/IGameScreenApi";
import { INPC } from "npc/INPC";
import IPlayer from "player/IPlayer";
import Objects, { Bound } from "utilities/Objects";
import AddItemToInventory from "../../action/AddItemToInventory";
import SetStat from "../../action/SetStat";
import { DebugToolsTranslation, translation } from "../../IDebugTools";
import AddItemToInventoryComponent, { AddItemToInventoryEvent } from "../component/AddItemToInventory";
import { DebugToolsPanelEvent } from "../component/DebugToolsPanel";
import InspectEntityInformationSubsection from "../component/InspectEntityInformationSubsection";

export default class HumanInformation extends InspectEntityInformationSubsection {
	private readonly addItemContainer: Component;
	private readonly reputationSliders: { [key in Stat.Malignity | Stat.Benignity]?: RangeRow } = {};

	private human: IPlayer | INPC | undefined;

	public constructor(gsapi: IGameScreenApi) {
		super(gsapi);

		this.addItemContainer = new Component(this.api).appendTo(this);

		this.addReputationSlider(DebugToolsTranslation.LabelMalignity, Stat.Malignity);
		this.addReputationSlider(DebugToolsTranslation.LabelBenignity, Stat.Benignity);

		this.on(DebugToolsPanelEvent.SwitchTo, () => {
			const addItemToInventory = AddItemToInventoryComponent.init(this.api).appendTo(this.addItemContainer);
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

		this.human = Entity.is(entity, EntityType.Creature) ? undefined : entity;
		this.toggle(!!this.human);

		this.trigger("change");

		if (!this.human) return;

		for (const type of Objects.keys<keyof HumanInformation["reputationSliders"]>(this.reputationSliders)) {
			this.reputationSliders[type]!.refresh();
		}

		this.until([ComponentEvent.Remove, "change"])
			.bind(entity as IEntity, EntityEvent.StatChanged, this.onStatChange);
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
			ActionExecutor.get(SetStat).execute(localPlayer, this.human!, type, value);
		};
	}

	@Bound
	private addItem(_: any, type: ItemType, quality: ItemQuality) {
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
