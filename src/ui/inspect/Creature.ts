import { ICreature } from "creature/ICreature";
import Button, { ButtonEvent } from "newui/component/Button";
import { CheckButton, CheckButtonEvent } from "newui/component/CheckButton";
import Component from "newui/component/Component";
import { UiApi } from "newui/INewUi";
import { Bound } from "utilities/Objects";
import Actions from "../../Actions";
import { translation } from "../../DebugTools";
import { DebugToolsTranslation } from "../../IDebugTools";
import { IInspectEntityInformationSubsection } from "./Entity";

export default class CreatureInformation extends Component implements IInspectEntityInformationSubsection {
	public constructor(api: UiApi, private readonly creature: ICreature) {
		super(api);

		new CheckButton(api)
			.setText(translation(DebugToolsTranslation.ButtonTameCreature))
			.setRefreshMethod(() => creature.isTamed())
			.on(CheckButtonEvent.Change, this.setTamed)
			.appendTo(this);

		new Button(api)
			.setText(translation(DebugToolsTranslation.ButtonRemoveThing))
			.on(ButtonEvent.Activate, this.removeCreature)
			.appendTo(this);
	}

	public getImmutableStats() {
		return [];
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
