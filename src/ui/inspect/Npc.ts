import ActionExecutor from "entity/action/ActionExecutor";
import Creature from "entity/creature/Creature";
import NPC from "entity/npc/NPC";
import Player from "entity/player/Player";
import Button from "newui/component/Button";
import Remove from "../../action/Remove";
import { DebugToolsTranslation, translation } from "../../IDebugTools";
import InspectEntityInformationSubsection from "../component/InspectEntityInformationSubsection";

export default class NpcInformation extends InspectEntityInformationSubsection {
	private npc: NPC | undefined;

	public constructor() {
		super();

		new Button()
			.setText(translation(DebugToolsTranslation.ButtonRemoveThing))
			.event.subscribe("activate", this.removeNPC)
			.appendTo(this);
	}

	@Override public update(entity: Creature | Player | NPC) {
		this.npc = entity.asNPC;
		this.toggle(!!this.npc);
	}

	@Bound
	private removeNPC() {
		ActionExecutor.get(Remove).execute(localPlayer, this.npc!);
	}
}
