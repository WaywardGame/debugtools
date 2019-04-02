import ActionExecutor from "entity/action/ActionExecutor";
import { ICorpse } from "entity/creature/corpse/ICorpse";
import { CreatureType } from "entity/creature/ICreature";
import { TextContext } from "language/Translation";
import Mod from "mod/Mod";
import Button from "newui/component/Button";
import { ITile } from "tile/ITerrain";
import { tuple } from "utilities/Arrays";
import Log from "utilities/Log";
import { IVector2 } from "utilities/math/IVector";
import { Bound } from "utilities/Objects";

import Heal from "../../action/Heal";
import Remove from "../../action/Remove";
import { DEBUG_TOOLS_ID, DebugToolsTranslation, translation } from "../../IDebugTools";
import { areArraysIdentical } from "../../util/Array";
import InspectInformationSection, { TabInformation } from "../component/InspectInformationSection";

export default class CorpseInformation extends InspectInformationSection {

	@Mod.log(DEBUG_TOOLS_ID)
	public readonly LOG: Log;

	private readonly resurrectButton: Button;

	private corpses: ICorpse[] = [];
	private corpse: ICorpse | undefined;

	public constructor() {
		super();

		this.resurrectButton = new Button()
			.setText(translation(DebugToolsTranslation.ButtonResurrectCorpse))
			.event.subscribe("activate", this.resurrect)
			.appendTo(this);

		new Button()
			.setText(translation(DebugToolsTranslation.ButtonRemoveThing))
			.event.subscribe("activate", this.removeCorpse)
			.appendTo(this);
	}

	public getTabs(): TabInformation[] {
		return this.corpses.entries().stream()
			.map(([i, corpse]) => tuple(i, () => translation(DebugToolsTranslation.CorpseName)
				.get(corpseManager.getName(corpse, false).inContext(TextContext.Title))))
			.toArray();
	}

	public setTab(corpse: number) {
		this.corpse = this.corpses[corpse];

		this.resurrectButton.toggle(this.corpse.type !== CreatureType.Blood && this.corpse.type !== CreatureType.WaterBlood);

		return this;
	}

	public update(position: IVector2, tile: ITile) {
		const corpses = [...tile.corpses || []];

		if (areArraysIdentical(corpses, this.corpses)) return;
		this.corpses = corpses;

		if (!this.corpses.length) return;

		this.setShouldLog();
	}

	public logUpdate() {
		for (const corpse of this.corpses) {
			this.LOG.info("Corpse:", corpse);
		}
	}

	@Bound
	private resurrect() {
		ActionExecutor.get(Heal).execute(localPlayer, this.corpse!);
		this.event.emit("update");
	}

	@Bound
	private removeCorpse() {
		ActionExecutor.get(Remove).execute(localPlayer, this.corpse!);
		this.event.emit("update");
	}
}
