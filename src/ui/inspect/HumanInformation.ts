import type Deity from "@wayward/game/game/deity/Deity";
import type Entity from "@wayward/game/game/entity/Entity";
import type Human from "@wayward/game/game/entity/Human";
import { StatusChangeReason } from "@wayward/game/game/entity/IEntity";
import { Stat } from "@wayward/game/game/entity/IStats";
import { BleedLevel } from "@wayward/game/game/entity/status/handler/IBleeding";
import { StatusType, DisplayStatusType } from "@wayward/game/game/entity/status/IStatus";
import Dictionary from "@wayward/game/language/Dictionary";
import { TextContext } from "@wayward/game/language/ITranslation";
import Translation from "@wayward/game/language/Translation";
import { CheckButton } from "@wayward/game/ui/component/CheckButton";
import Component from "@wayward/game/ui/component/Component";
import type { RangeRow } from "@wayward/game/ui/component/RangeRow";
import _ from "@wayward/utilities/_";
import { Bound } from "@wayward/utilities/Decorators";
import { OwnEventHandler } from "@wayward/utilities/event/EventManager";
import Container from "../component/Container";
import InspectEntityInformationSubsection from "../component/InspectEntityInformationSubsection";

export default class HumanInformation extends InspectEntityInformationSubsection {
	private readonly addItemContainer: Component;
	private readonly alignmentSliders: Partial<Record<Deity.Evil | Deity.Good, RangeRow>> = {};
	private readonly statusCheckButtons: PartialRecord<DisplayStatusType | StatusType, CheckButton> = {};

	private human: Human | undefined;

	public constructor() {
		super();

		this.addItemContainer = new Component().appendTo(this);

		for (const status of [DisplayStatusType.Cut, StatusType.Bleeding, StatusType.Burned, StatusType.Poisoned, StatusType.Frostbitten] as const) {
			this.statusCheckButtons[status] = new CheckButton()
				.setText((_
					?? (status === DisplayStatusType.Cut ? Translation.get(Dictionary.BleedLevel, BleedLevel.Minor) : undefined)
					?? Translation.get(Dictionary.Status, status as StatusType))
					.inContext(TextContext.Title))
				.setRefreshMethod(() => _
					?? (status === DisplayStatusType.Cut ? this.human?.getStatusLevel(StatusType.Bleeding) === BleedLevel.Minor : undefined)
					?? (status === StatusType.Bleeding ? this.human?.getStatusLevel(StatusType.Bleeding) === BleedLevel.Major : undefined)
					?? !!this.human?.hasStatus(status as StatusType))
				.event.subscribe("toggle", (_: any, state: boolean) =>
					this.human?.setStatus(
						status === DisplayStatusType.Cut ? StatusType.Bleeding : status,
						state && status === StatusType.Bleeding ? BleedLevel.Major : state,
						state ? StatusChangeReason.Gained : StatusChangeReason.Treated,
						true))
				.appendTo(this);
		}
	}

	@OwnEventHandler(HumanInformation, "switchTo")
	protected onSwitchTo(): void {
		this.addItemContainer.dump();
		void Container.appendTo(this.addItemContainer, this, () => this.human);
	}

	public override getImmutableStats(): Stat[] {
		return this.human ? [
			Stat.Attack,
			Stat.Defense,
			Stat.Weight,
			Stat.InsulationHeat,
			Stat.InsulationCold,
		] : [];
	}

	public override update(entity: Entity): void {
		if (this.human === entity) {
			return;
		}

		this.human = entity.asHuman;
		this.toggle(!!this.human);

		this.event.emit("change");

		if (!this.human) {
			return;
		}

		for (const slider of Object.values(this.alignmentSliders)) {
			slider.refresh();
		}

		for (const checkButton of Object.values(this.statusCheckButtons)) {
			checkButton.refresh();
		}

		const entityEvents = entity?.asHuman?.event.until(this, "switchAway");
		entityEvents?.subscribe("statusChange", this.onStatusChange);
	}

	@Bound private onStatusChange(_: any, status: StatusType): void {
		this.statusCheckButtons[status]?.refresh(false);
		this.statusCheckButtons[status === StatusType.Bleeding ? DisplayStatusType.Cut : -1 as StatusType]?.refresh(false);
	}
}
