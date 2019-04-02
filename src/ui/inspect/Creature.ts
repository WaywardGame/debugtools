import ActionExecutor from "entity/action/ActionExecutor";
import { ICreature } from "entity/creature/ICreature";
import Entity from "entity/Entity";
import { EntityType } from "entity/IEntity";
import { INPC } from "entity/npc/INPC";
import { IPlayer } from "entity/player/IPlayer";
import Button from "newui/component/Button";
import { CheckButton } from "newui/component/CheckButton";
import { Bound } from "utilities/Objects";

import Remove from "../../action/Remove";
import SetTamed from "../../action/SetTamed";
import { DebugToolsTranslation, translation } from "../../IDebugTools";
import InspectEntityInformationSubsection from "../component/InspectEntityInformationSubsection";

export default class CreatureInformation extends InspectEntityInformationSubsection {
	private creature: ICreature | undefined;

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

	public update(entity: ICreature | INPC | IPlayer) {
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
