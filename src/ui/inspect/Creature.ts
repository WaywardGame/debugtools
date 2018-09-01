import { ICreature } from "creature/ICreature";
import { EntityType } from "entity/IEntity";
import Button, { ButtonEvent } from "newui/component/Button";
import { CheckButton, CheckButtonEvent } from "newui/component/CheckButton";
import { UiApi } from "newui/INewUi";
import { INPC } from "npc/INPC";
import { IPlayer } from "player/IPlayer";
import { Bound } from "utilities/Objects";
import Actions from "../../Actions";
import { translation } from "../../DebugTools";
import { DebugToolsTranslation } from "../../IDebugTools";
import InspectEntityInformationSubsection from "../component/InspectEntityInformationSubsection";

export default class CreatureInformation extends InspectEntityInformationSubsection {
	private creature: ICreature | undefined;

	public constructor(api: UiApi) {
		super(api);

		new CheckButton(api)
			.setText(translation(DebugToolsTranslation.ButtonTameCreature))
			.setRefreshMethod(() => this.creature ? this.creature.isTamed() : false)
			.on(CheckButtonEvent.Change, this.setTamed)
			.appendTo(this);

		new Button(api)
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
		Actions.get("setTamed").execute({ creature: this.creature, object: tamed });
	}

	@Bound
	private removeCreature() {
		Actions.get("remove").execute({ creature: this.creature });
	}
}
