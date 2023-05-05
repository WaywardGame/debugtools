import Corpse from "game/entity/creature/corpse/Corpse";
import Tile from "game/tile/Tile";
import { TextContext } from "language/ITranslation";
import { Article } from "language/Translation";
import Mod from "mod/Mod";
import Button from "ui/component/Button";
import { Bound } from "utilities/Decorators";
import Log from "utilities/Log";
import { Tuple } from "utilities/collection/Tuple";
import { DEBUG_TOOLS_ID, DebugToolsTranslation, translation } from "../../IDebugTools";
import Heal from "../../action/Heal";
import Remove from "../../action/Remove";
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

	public override getTabs(): TabInformation[] {
		return this.corpses.entries().stream()
			.map(([i, corpse]) => Tuple(i, () => translation(DebugToolsTranslation.CorpseName)
				.get(localIsland.corpses.getName(corpse, Article.None).inContext(TextContext.Title))))
			.toArray();
	}

	public override setTab(corpse: number) {
		this.corpse = this.corpses[corpse];
		return this;
	}

	public override update(tile: Tile) {
		const corpses = [...tile.corpses || []];

		if (areArraysIdentical(corpses, this.corpses)) return;
		this.corpses = corpses;

		if (!this.corpses.length) return;

		this.setShouldLog();
	}

	public override logUpdate() {
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
