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

import Creature from "@wayward/game/game/entity/creature/Creature";
import Entity from "@wayward/game/game/entity/Entity";
import Button from "@wayward/game/ui/component/Button";
import { CheckButton } from "@wayward/game/ui/component/CheckButton";
import { Bound } from "@wayward/utilities/Decorators";
import Remove from "../../action/Remove";
import SetTamed from "../../action/SetTamed";
import { DebugToolsTranslation, translation } from "../../IDebugTools";
import InspectEntityInformationSubsection from "../component/InspectEntityInformationSubsection";

export default class CreatureInformation extends InspectEntityInformationSubsection {
	private creature: Creature | undefined;
	private tamedButton: CheckButton;

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
	}

	public override update(entity: Entity): void {
		this.creature = entity.asCreature;
		this.tamedButton.refresh();
		this.toggle(!!this.creature);
	}

	@Bound
	private setTamed(_: any, tamed: boolean): void {
		SetTamed.execute(localPlayer, this.creature!, tamed);
	}

	@Bound
	private removeCreature(): void {
		Remove.execute(localPlayer, this.creature!);
	}
}
