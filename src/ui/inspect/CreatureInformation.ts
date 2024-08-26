/*!
 * Copyright 2011-2024 Unlok
 * https://www.unlok.ca
 *
 * Credits & Thanks:
 * https://www.unlok.ca/credits-thanks/
 *
 * Wayward is a copyrighted and licensed work. Modification and/or distribution of any source files is prohibited. If you wish to modify the game in any way, please refer to the modding guide:
 * https://github.com/WaywardGame/types/wiki
 */

import { AiMaskType, AiType, aiMaskDescriptions } from "@wayward/game/game/entity/ai/AI";
import Creature from "@wayward/game/game/entity/creature/Creature";
import Entity from "@wayward/game/game/entity/Entity";
import Translation from "@wayward/game/language/Translation";
import Button from "@wayward/game/ui/component/Button";
import { CheckButton } from "@wayward/game/ui/component/CheckButton";
import Component from "@wayward/game/ui/component/Component";
import Details from "@wayward/game/ui/component/Details";
import { LabelledRow } from "@wayward/game/ui/component/LabelledRow";
import Text from "@wayward/game/ui/component/Text";
import Enums from "@wayward/game/utilities/enum/Enums";
import { Bound } from "@wayward/utilities/Decorators";
import Math2 from "@wayward/utilities/math/Math2";
import Remove from "../../action/Remove";
import SetTamed from "../../action/SetTamed";
import ToggleAiMask from "../../action/ToggleAiMask";
import ToggleAiType from "../../action/ToggleAiType";
import { DebugToolsTranslation, translation } from "../../IDebugTools";
import InspectEntityInformationSubsection from "../component/InspectEntityInformationSubsection";

interface IAiRefreshable {
	refresh?(): any;
	refreshText?(): any;
}

export default class CreatureInformation extends InspectEntityInformationSubsection {

	private creature: Creature | undefined;
	private tamedButton: CheckButton;
	private aiRefreshables: IAiRefreshable[] = [];
	private wanderIntent: Component;
	private towardsZoneCenter: Component;

	public constructor() {
		super();

		this.tamedButton = new CheckButton()
			.setText(translation(DebugToolsTranslation.ButtonTameCreature))
			.setRefreshMethod(() => this.creature ? this.creature.isTamed : false)
			.event.subscribe("toggle", this.setTamed)
			.appendTo(this);

		new Button()
			.setText(translation(DebugToolsTranslation.ButtonRemoveThing))
			.event.subscribe("activate", this.removeCreature)
			.appendTo(this);

		const translateAi = (ai = 0) => Math2.bits(ai)
			.values()
			.map(aiType => AiType[aiType])
			.collect(Translation.formatList);

		const registerAiRefreshable = (refreshable: Button | Text) => this.aiRefreshables.push(refreshable);
		new Text()
			.setText(Translation.labelled(translation(DebugToolsTranslation.LabelAi))
				.addArgs(() => translateAi(this.creature?.ai.lastCalculatedAiClientSide)))
			.schedule(registerAiRefreshable)
			.appendTo(this);

		new Details()
			.setSummary(summary => summary
				.setText(Translation.labelled(translation(DebugToolsTranslation.LabelAiMasks))
					.addArgs(() => this.creature?.ai.aiMasks
						.sort(maskType => aiMaskDescriptions[maskType]?.priority ?? 0)
						.map(mask => Translation.colorizeImportance(this.creature?.ai.hasMask(mask) ? "primary" : "secondary")
							.addArgs(AiMaskType[mask]))
						.collect(Translation.formatList)))
				.setTooltip(tooltip => {
					let includes = 0;
					let excludes = 0;
					for (const mask of this.creature?.ai.aiMasks ?? []) {
						const description = aiMaskDescriptions[mask];
						if (!description || !this.creature || !this.creature.ai.hasMask(mask))
							// mask not active
							continue;

						includes |= description.include ?? 0;
						includes &= ~(description.exclude ?? 0);
						excludes |= description.exclude ?? 0;
						excludes &= ~(description.include ?? 0);
					}

					tooltip.addBlock(block => block
						.addParagraph(p => p.setText(Translation.labelled(translation(DebugToolsTranslation.LabelIncludes))
							.addArgs(translateAi(includes))))
						.addParagraph(p => p.setText(Translation.labelled(translation(DebugToolsTranslation.LabelExcludes))
							.addArgs(translateAi(excludes)))));
				})
				.schedule(registerAiRefreshable))
			.append(...Enums.values(AiMaskType).slice()
				.sort(maskType => aiMaskDescriptions[maskType]?.priority ?? 0)
				.map(maskType => new CheckButton()
					.setText(Translation.merge(AiMaskType[maskType]))
					.setTooltip(tooltip => tooltip.addBlock(block => block
						.addParagraph(p => p.setText(Translation.labelled(translation(DebugToolsTranslation.LabelIncludes))
							.addArgs(translateAi(aiMaskDescriptions[maskType]?.include))))
						.addParagraph(p => p.setText(Translation.labelled(translation(DebugToolsTranslation.LabelExcludes))
							.addArgs(translateAi(aiMaskDescriptions[maskType]?.exclude))))
						.addParagraph(p => p.setText(Translation.labelled(translation(DebugToolsTranslation.LabelCondition))
							.addArgs(translation(!aiMaskDescriptions[maskType]?.condition || !this.creature ? DebugToolsTranslation.ConditionAlwaysActive
								: aiMaskDescriptions[maskType].condition(this.creature) ? DebugToolsTranslation.ConditionMet
									: DebugToolsTranslation.ConditionUnmet))))))
					.setRefreshMethod(() => !!this.creature?.ai.aiMasks.includes(maskType))
					.event.subscribe("toggle", (_, checked) =>
						this.creature && ToggleAiMask.execute(localPlayer, this.creature, maskType, checked))
					.schedule(registerAiRefreshable)))
			.appendTo(this);

		new Details()
			.setSummary(summary => summary
				.setText(Translation.labelled(translation(DebugToolsTranslation.LabelBaseAi))
					.addArgs(() => translateAi(this.creature?.ai.ai)))
				.schedule(registerAiRefreshable))
			.append(...Enums.values(AiType)
				.filter(type => Math2.bits(type).size === 1)
				.map(aiType => new CheckButton()
					.setText(Translation.merge(AiType[aiType]))
					.setRefreshMethod(() => !!((this.creature?.ai.ai ?? 0) & aiType))
					.event.subscribe("toggle", (_, checked) =>
						this.creature && ToggleAiType.execute(localPlayer, this.creature, aiType, checked))
					.schedule(registerAiRefreshable)))
			.appendTo(this);

		new LabelledRow()
			.setLabel(label => label.setText(translation(DebugToolsTranslation.LabelWanderIntent)))
			.append(this.wanderIntent = new Component().classes.add("debug-tools-wander-intent"))
			.append(this.towardsZoneCenter = new Component().classes.add("debug-tools-wander-intent"))
			.appendTo(this);
	}

	public override update(entity: Entity): void {
		if (this.creature === entity) return;

		this.creature = entity.asCreature;
		this.event.emit("change");

		this.tamedButton.refresh();
		this.toggle(!!this.creature);

		const untilChangeOrRemove = this.creature?.event.until(this, "change", "remove");
		untilChangeOrRemove?.subscribe(["changeAi", "changeAiMask"], this.onChangeAi);
		untilChangeOrRemove?.subscribe(["changeWanderIntent"], this.onChangeWanderIntent);
		this.onChangeAi();
		this.onChangeWanderIntent(this.creature, this.creature?.ai?.["wanderIntent"], this.creature?.ai.getDirectionToHomePoint()?.toRadians());
	}

	@Bound
	private setTamed(_: any, tamed: boolean): void {
		SetTamed.execute(localPlayer, this.creature!, tamed);
	}

	@Bound
	private removeCreature(): void {
		Remove.execute(localPlayer, this.creature!);
	}

	@Bound
	private onChangeAi() {
		for (const refreshable of this.aiRefreshables) {
			refreshable.refresh?.();
			refreshable.refreshText?.();
		}
	}

	@Bound
	private onChangeWanderIntent(creature?: Creature, wanderIntent?: number, towardsZoneCenter?: number) {
		this.wanderIntent
			.classes.toggle(wanderIntent === undefined, "debug-tools-wander-intent-none")
			.style.set("--direction", `${wanderIntent ?? 0}rad`);
		this.towardsZoneCenter
			.classes.toggle(towardsZoneCenter === undefined, "debug-tools-wander-intent-none")
			.style.set("--direction", `${Math.PI * 2 + (towardsZoneCenter ?? 0)}rad`);
	}
}
