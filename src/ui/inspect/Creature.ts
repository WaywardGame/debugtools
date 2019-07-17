import ActionExecutor from "entity/action/ActionExecutor";
import Creature from "entity/creature/Creature";
import Entity from "entity/Entity";
import { EntityType } from "entity/IEntity";
import NPC from "entity/npc/NPC";
import Player from "entity/player/Player";
import Button from "newui/component/Button";
import { CheckButton } from "newui/component/CheckButton";

import Remove from "../../action/Remove";
import SetTamed from "../../action/SetTamed";
import { DebugToolsTranslation, translation } from "../../IDebugTools";
import InspectEntityInformationSubsection from "../component/InspectEntityInformationSubsection";

export default class CreatureInformation extends InspectEntityInformationSubsection {
	private creature: Creature | undefined;

	public constructor() {
		super();

		new CheckButton()
			.setText(translation(DebugToolsTranslation.ButtonTameCreature))
			.setRefreshMethod(() => this.creature ? this.creature.isTamed() : false)
			.event.subscribe("toggle", this.setTamed)
			.appendTo(this);

		new Button()
			.setText(translation(DebugToolsTranslation.ButtonRemoveThing))
			.event.subscribe("activate", this.removeCreature)
			.appendTo(this);
	}

	@Override public update(entity: Creature | NPC | Player) {
		this.creature = Entity.is(entity, EntityType.Creature) ? entity : undefined;
		this.toggle(!!this.creature);
	}

	@Bound
	private setTamed(_: any, tamed: boolean) {
		ActionExecutor.get(SetTamed).execute(localPlayer, this.creature!, tamed);
	}

	@Bound
	private removeCreature() {
		ActionExecutor.get(Remove).execute(localPlayer, this.creature!);
	}
}
