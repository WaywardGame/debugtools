import ActionExecutor from "action/ActionExecutor";
import { ICreature } from "creature/ICreature";
import { EntityType } from "entity/IEntity";
import Button, { ButtonEvent } from "newui/component/Button";
import { CheckButton, CheckButtonEvent } from "newui/component/CheckButton";
import IGameScreenApi from "newui/screen/screens/game/IGameScreenApi";
import { INPC } from "npc/INPC";
import { IPlayer } from "player/IPlayer";
import { Bound } from "utilities/Objects";
import Remove from "../../action/Remove";
import SetTamed from "../../action/SetTamed";
import { DebugToolsTranslation, translation } from "../../IDebugTools";
import InspectEntityInformationSubsection from "../component/InspectEntityInformationSubsection";

export default class CreatureInformation extends InspectEntityInformationSubsection {
	private creature: ICreature | undefined;

	public constructor(gsapi: IGameScreenApi) {
		super(gsapi);

		new CheckButton(this.api)
			.setText(translation(DebugToolsTranslation.ButtonTameCreature))
			.setRefreshMethod(() => this.creature ? this.creature.isTamed() : false)
			.on(CheckButtonEvent.Change, this.setTamed)
			.appendTo(this);

		new Button(this.api)
			.setText(translation(DebugToolsTranslation.ButtonRemoveThing))
			.on(ButtonEvent.Activate, this.removeCreature)
			.appendTo(this);
	}

	public update(entity: ICreature | INPC | IPlayer) {
		this.creature = entity.entityType === EntityType.Creature ? entity : undefined;
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
