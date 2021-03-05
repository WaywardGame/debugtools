import Corpse from "game/entity/creature/corpse/Corpse";
import { ITile } from "game/tile/ITerrain";
import { TextContext } from "language/Translation";
import Mod from "mod/Mod";
import Button from "ui/component/Button";
import { Tuple } from "utilities/collection/Arrays";
import Log from "utilities/Log";
import { IVector2 } from "utilities/math/IVector";
import Heal from "../../action/Heal";
import Remove from "../../action/Remove";
import { DebugToolsTranslation, DEBUG_TOOLS_ID, translation } from "../../IDebugTools";
import { areArraysIdentical } from "../../util/Array";
import InspectInformationSection, { TabInformation } from "../component/InspectInformationSection";


export default class CorpseInformation extends InspectInformationSection {

	@Mod.log(DEBUG_TOOLS_ID)
	public readonly LOG: Log;

	private corpses: Corpse[] = [];
	private corpse: Corpse | undefined;

	public constructor() {
		super();

		new Button()
			.setText(translation(DebugToolsTranslation.ButtonResurrectCorpse))
			.event.subscribe("activate", this.resurrect)
			.appendTo(this);

		new Button()
			.setText(translation(DebugToolsTranslation.ButtonRemoveThing))
			.event.subscribe("activate", this.removeCorpse)
			.appendTo(this);
	}

	@Override public getTabs(): TabInformation[] {
		return this.corpses.entries().stream()
			.map(([i, corpse]) => Tuple(i, () => translation(DebugToolsTranslation.CorpseName)
				.get(corpseManager.getName(corpse, false).inContext(TextContext.Title))))
			.toArray();
	}

	@Override public setTab(corpse: number) {
		this.corpse = this.corpses[corpse];
		return this;
	}

	@Override public update(position: IVector2, tile: ITile) {
		const corpses = [...tile.corpses || []];

		if (areArraysIdentical(corpses, this.corpses)) return;
		this.corpses = corpses;

		if (!this.corpses.length) return;

		this.setShouldLog();
	}

	@Override public logUpdate() {
		for (const corpse of this.corpses) {
			this.LOG.info("Corpse:", corpse);
		}
	}

	@Bound
	private resurrect() {
		Heal.execute(localPlayer, this.corpse!);
		this.event.emit("update");
	}

	@Bound
	private removeCorpse() {
		Remove.execute(localPlayer, this.corpse!);
		this.event.emit("update");
	}
}
