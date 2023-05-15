import { OwnEventHandler } from "event/EventManager";
import Entity from "game/entity/Entity";
import Human, { REPUTATION_MAX } from "game/entity/Human";
import { StatusEffectChangeReason, StatusType } from "game/entity/IEntity";
import { IStat, Stat } from "game/entity/IStats";
import Dictionary from "language/Dictionary";
import { TextContext } from "language/ITranslation";
import Translation from "language/Translation";
import { CheckButton } from "ui/component/CheckButton";
import Component from "ui/component/Component";
import { RangeRow } from "ui/component/RangeRow";
import { Bound } from "utilities/Decorators";
import { DebugToolsTranslation, translation } from "../../IDebugTools";
import SetStat from "../../action/SetStat";
import Container from "../component/Container";
import InspectEntityInformationSubsection from "../component/InspectEntityInformationSubsection";

export default class HumanInformation extends InspectEntityInformationSubsection {
	private readonly addItemContainer: Component;
	private readonly reputationSliders: { [key in Stat.Malignity | Stat.Benignity]?: RangeRow } = {};
	private readonly statusCheckButtons: PartialRecord<StatusType, CheckButton> = {};

	private human: Human | undefined;

	public constructor() {
		super();

		this.addItemContainer = new Component().appendTo(this);

		this.addReputationSlider(DebugToolsTranslation.LabelMalignity, Stat.Malignity);
		this.addReputationSlider(DebugToolsTranslation.LabelBenignity, Stat.Benignity);

		for (const status of [StatusType.Bleeding, StatusType.Burned, StatusType.Poisoned, StatusType.Frostbitten]) {
			this.statusCheckButtons[status] = new CheckButton()
				.setText(Translation.get(Dictionary.StatusEffect, status).inContext(TextContext.Title))
				.setRefreshMethod(() => !!this.human?.hasStatus(status))
				.event.subscribe("toggle", (_: any, state: boolean) => this.human?.setStatus(status, state, state ? StatusEffectChangeReason.Gained : StatusEffectChangeReason.Treated))
				.appendTo(this);
		}
	}

	@OwnEventHandler(HumanInformation, "switchTo")
	protected onSwitchTo() {
		Container.appendTo(this.addItemContainer, this, () => this.human?.inventory);
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

		for (const slider of Object.values(this.reputationSliders)) {
			slider.refresh();
		}

		for (const checkButton of Object.values(this.statusCheckButtons)) {
			checkButton.refresh();
		}

		const entityEvents = entity?.asEntityWithStats?.event.until(this, "switchAway");
		entityEvents?.subscribe("statChanged", this.onStatChange);
		entityEvents?.subscribe("statusChange", this.onStatusChange);
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
	private onStatChange(_: any, stat: IStat) {
		switch (stat.type) {
			case Stat.Malignity:
			case Stat.Benignity:
				this.reputationSliders[stat.type]!.refresh();
				break;
		}
	}

	@Bound private onStatusChange(_: any, status: StatusType) {
		this.statusCheckButtons[status]?.refresh();
	}
}
