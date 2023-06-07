/*!
 * Copyright 2011-2023 Unlok
 * https://www.unlok.ca
 *
 * Credits & Thanks:
 * https://www.unlok.ca/credits-thanks/
 *
 * Wayward is a copyrighted and licensed work. Modification and/or distribution of any source files is prohibited. If you wish to modify the game in any way, please refer to the modding guide:
 * https://github.com/WaywardGame/types/wiki
 */

import Creature from "game/entity/creature/Creature";
import NPC from "game/entity/npc/NPC";
import Player from "game/entity/player/Player";
import Button from "ui/component/Button";
import { Bound } from "utilities/Decorators";
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

	public override update(entity: Creature | Player | NPC) {
		this.npc = entity.asNPC;
		this.toggle(!!this.npc);
	}

	@Bound
	private removeNPC() {
		Remove.execute(localPlayer, this.npc!);
	}
}
