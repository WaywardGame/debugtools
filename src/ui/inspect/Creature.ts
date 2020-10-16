import Creature from "entity/creature/Creature";
import Entity from "entity/Entity";
import Button from "newui/component/Button";
import { CheckButton } from "newui/component/CheckButton";
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
			.setRefreshMethod(() => this.creature ? this.creature.isTamed() : false)
			.event.subscribe("toggle", this.setTamed)
			.appendTo(this);

		new Button()
			.setText(translation(DebugToolsTranslation.ButtonRemoveThing))
			.event.subscribe("activate", this.removeCreature)
			.appendTo(this);
	}

	@Override public update(entity: Entity) {
		this.creature = entity.asCreature;
		this.tamedButton.refresh();
		this.toggle(!!this.creature);
	}

	@Bound
	private setTamed(_: any, tamed: boolean) {
		SetTamed.execute(localPlayer, this.creature!, tamed);
	}

	@Bound
	private removeCreature() {
		Remove.execute(localPlayer, this.creature!);
	}
}
