import Button, { ButtonEvent } from "newui/component/Button";
import { UiApi } from "newui/INewUi";
import { INPC } from "npc/INPC";
import { Bound } from "utilities/Objects";
import Actions from "../../Actions";
import { translation } from "../../DebugTools";
import { DebugToolsTranslation } from "../../IDebugTools";
import HumanInformation from "./Human";

export default class NpcInformation extends HumanInformation {
	public constructor(api: UiApi, private readonly npc: INPC) {
		super(api, npc);

		new Button(api)
			.setText(translation(DebugToolsTranslation.ButtonRemoveThing))
			.on(ButtonEvent.Activate, this.removeNPC)
			.appendTo(this);
	}

	@Bound
	private removeNPC() {
		Actions.get("remove").execute({ npc: this.npc });
	}
}
