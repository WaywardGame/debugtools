import type Corpse from "@wayward/game/game/entity/creature/corpse/Corpse";
import type Tile from "@wayward/game/game/tile/Tile";
import { TextContext } from "@wayward/game/language/ITranslation";
import { Article } from "@wayward/game/language/Translation";
import Mod from "@wayward/game/mod/Mod";
import Button from "@wayward/game/ui/component/Button";
import { Bound } from "@wayward/utilities/Decorators";
import type Log from "@wayward/utilities/Log";
import { Tuple } from "@wayward/utilities/collection/Tuple";
import { DEBUG_TOOLS_ID, DebugToolsTranslation, translation } from "../../IDebugTools";
import Heal from "../../action/Heal";
import Remove from "../../action/Remove";
import { areArraysIdentical } from "../../util/Array";
import type { TabInformation } from "../component/InspectInformationSection";
import InspectInformationSection from "../component/InspectInformationSection";

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
		return this.corpses.entries()
			.map(([i, corpse]) => Tuple(i, () => translation(DebugToolsTranslation.CorpseName)
				.get(localIsland.corpses.getName(corpse, Article.None).inContext(TextContext.Title))))
			.toArray();
	}

	public override setTab(corpse: number): this {
		this.corpse = this.corpses[corpse];
		return this;
	}

	public override update(tile: Tile): void {
		const corpses = [...tile.corpses || []];

		if (areArraysIdentical(corpses, this.corpses)) {
			return;
		}

		this.corpses = corpses;

		if (!this.corpses.length) {
			return;
		}

		this.setShouldLog();
	}

	public override logUpdate(): void {
		for (const corpse of this.corpses) {
			this.LOG.info("Corpse:", corpse?.["debug"]);
		}
	}

	@Bound
	private resurrect(): void {
		void Heal.execute(localPlayer, this.corpse!);
		this.event.emit("update");
	}

	@Bound
	private removeCorpse(): void {
		void Remove.execute(localPlayer, this.corpse!);
		this.event.emit("update");
	}
}
