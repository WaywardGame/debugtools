import ActionExecutor from "entity/action/ActionExecutor";
import { ICreature } from "entity/creature/ICreature";
import Entity from "entity/Entity";
import { EntityType } from "entity/IEntity";
import { INPC } from "entity/npc/INPC";
import { IPlayer } from "entity/player/IPlayer";
import Button from "newui/component/Button";

import Remove from "../../action/Remove";
import { DebugToolsTranslation, translation } from "../../IDebugTools";
import InspectEntityInformationSubsection from "../component/InspectEntityInformationSubsection";

export default class NpcInformation extends InspectEntityInformationSubsection {
	private npc: INPC | undefined;

	public constructor() {
		super();

		new Button()
			.setText(translation(DebugToolsTranslation.ButtonRemoveThing))
			.event.subscribe("activate", this.removeNPC)
			.appendTo(this);
	}

	@Override public update(entity: ICreature | IPlayer | INPC) {
		this.npc = Entity.is(entity, EntityType.NPC) ? entity : undefined;
		this.toggle(!!this.npc);
	}

	@Bound
	private removeNPC() {
		ActionExecutor.get(Remove).execute(localPlayer, this.npc!);
	}
}
