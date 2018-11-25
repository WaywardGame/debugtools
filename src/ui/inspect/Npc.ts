import ActionExecutor from "action/ActionExecutor";
import { ICreature } from "creature/ICreature";
import Entity from "entity/Entity";
import { EntityType } from "entity/IEntity";
import Button, { ButtonEvent } from "newui/component/Button";
import IGameScreenApi from "newui/screen/screens/game/IGameScreenApi";
import { INPC } from "npc/INPC";
import { IPlayer } from "player/IPlayer";
import { Bound } from "utilities/Objects";
import Remove from "../../action/Remove";
import { DebugToolsTranslation, translation } from "../../IDebugTools";
import InspectEntityInformationSubsection from "../component/InspectEntityInformationSubsection";

export default class NpcInformation extends InspectEntityInformationSubsection {
	private npc: INPC | undefined;

	public constructor(gsapi: IGameScreenApi) {
		super(gsapi);

		new Button(this.api)
			.setText(translation(DebugToolsTranslation.ButtonRemoveThing))
			.on(ButtonEvent.Activate, this.removeNPC)
			.appendTo(this);
	}

	public update(entity: ICreature | IPlayer | INPC) {
		this.npc = Entity.is(entity, EntityType.NPC) ? entity : undefined;
		this.toggle(!!this.npc);
	}

	@Bound
	private removeNPC() {
		ActionExecutor.get(Remove).execute(localPlayer, this.npc!);
	}
}
