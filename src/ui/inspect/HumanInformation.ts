/*!
 * Copyright 2011-2023 Unlok
 * https://www.unlok.ca
 *
 * Credits & Thanks:
 * https://www.unlok.ca/credits-thanks/
 *
 * Wayward is a copyrighted and licensed work. Modification and/or distribution of any source files is prohibited. If you wish to modify the game in any way, please refer to the modding guide:
 * https://github.com/WaywardGame/types/wiki
 */

import { Deity } from "@wayward/game/game/deity/Deity";
import Entity from "@wayward/game/game/entity/Entity";
import Human from "@wayward/game/game/entity/Human";
import { StatusEffectChangeReason, StatusType } from "@wayward/game/game/entity/IEntity";
import { Stat } from "@wayward/game/game/entity/IStats";
import Dictionary from "@wayward/game/language/Dictionary";
import { TextContext } from "@wayward/game/language/ITranslation";
import Translation from "@wayward/game/language/Translation";
import { CheckButton } from "@wayward/game/ui/component/CheckButton";
import Component from "@wayward/game/ui/component/Component";
import { RangeRow } from "@wayward/game/ui/component/RangeRow";
import { Bound } from "@wayward/utilities/Decorators";
import { OwnEventHandler } from "@wayward/utilities/event/EventManager";
import { DebugToolsTranslation, translation } from "../../IDebugTools";
import SetAlignment from "../../action/SetAlignment";
import Container from "../component/Container";
import InspectEntityInformationSubsection from "../component/InspectEntityInformationSubsection";

export default class HumanInformation extends InspectEntityInformationSubsection {
	private readonly addItemContainer: Component;
	private readonly alignmentSliders: { [key in Deity.Evil | Deity.Good]?: RangeRow } = {};
	private readonly statusCheckButtons: PartialRecord<StatusType, CheckButton> = {};

	private human: Human | undefined;

	public constructor() {
		super();

		this.addItemContainer = new Component().appendTo(this);

		this.addAlignmentSlider(DebugToolsTranslation.LabelEvilAlignment, Deity.Evil);
		this.addAlignmentSlider(DebugToolsTranslation.LabelGoodAlignment, Deity.Good);

		for (const status of [StatusType.Bleeding, StatusType.Burned, StatusType.Poisoned, StatusType.Frostbitten]) {
			this.statusCheckButtons[status] = new CheckButton()
				.setText(Translation.get(Dictionary.StatusEffect, status).inContext(TextContext.Title))
				.setRefreshMethod(() => !!this.human?.hasStatus(status))
				.event.subscribe("toggle", (_: any, state: boolean) => this.human?.setStatus(status, state, state ? StatusEffectChangeReason.Gained : StatusEffectChangeReason.Treated))
				.appendTo(this);
		}
	}

	@OwnEventHandler(HumanInformation, "switchTo")
	protected onSwitchTo(): void {
		Container.appendTo(this.addItemContainer, this, () => this.human);
	}

	public override getImmutableStats(): Stat[] {
		return this.human ? [
			Stat.Attack,
			Stat.Defense,
			Stat.Ferocity,
			Stat.Weight,
			Stat.InsulationHeat,
			Stat.InsulationCold,
		] : [];
	}

	public override update(entity: Entity): void {
		if (this.human === entity) return;

		this.human = entity.asHuman;
		this.toggle(!!this.human);

		this.event.emit("change");

		if (!this.human) return;

		for (const slider of Object.values(this.alignmentSliders)) {
			slider.refresh();
		}

		for (const checkButton of Object.values(this.statusCheckButtons)) {
			checkButton.refresh();
		}

		const entityEvents = entity?.asHuman?.event.until(this, "switchAway");
		entityEvents?.subscribe("alignmentChange", this.onAlignmentChange);
		entityEvents?.subscribe("statusChange", this.onStatusChange);
	}

	private addAlignmentSlider(labelTranslation: DebugToolsTranslation, type: Deity.Good | Deity.Evil): void {
		this.alignmentSliders[type] = new RangeRow()
			.setLabel(label => label.setText(translation(labelTranslation)))
			.editRange(range => range
				.setMin(0)
				.setMax(game.getGameOptions().player.alignment[type === Deity.Good ? "goodCap" : "evilCap"])
				.setRefreshMethod(() => this.human ? this.human.alignment[type === Deity.Good ? "good" : "evil"] : 0))
			.setDisplayValue(true)
			.event.subscribe("finish", this.setAlignment(type))
			.appendTo(this);
	}

	private setAlignment(type: Deity.Evil | Deity.Good): (_: any, value: number) => void {
		return (_: any, value: number) => {
			if (this.human!.alignment[type === Deity.Good ? "good" : "evil"] === value) return;
			SetAlignment.execute(localPlayer, this.human!, type, value);
		};
	}

	@Bound
	private onAlignmentChange(_: any, deity: Deity): void {
		switch (deity) {
			case Deity.Evil:
			case Deity.Good:
				this.alignmentSliders[deity]!.refresh();
				break;
		}
	}

	@Bound private onStatusChange(_: any, status: StatusType): void {
		this.statusCheckButtons[status]?.refresh();
	}
}
