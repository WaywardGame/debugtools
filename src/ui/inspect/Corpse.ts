import { ICorpse } from "creature/corpse/ICorpse";
import { CreatureType, SentenceCaseStyle } from "Enums";
import Mod from "mod/Mod";
import Button, { ButtonEvent } from "newui/component/Button";
import IGameScreenApi from "newui/screen/screens/game/IGameScreenApi";
import { ITile } from "tile/ITerrain";
import { tuple } from "utilities/Arrays";
import Collectors from "utilities/Collectors";
import Log from "utilities/Log";
import { IVector2 } from "utilities/math/IVector";
import { Bound } from "utilities/Objects";
import Actions, { RemovalType } from "../../Actions";
import { DEBUG_TOOLS_ID, DebugToolsTranslation, translation } from "../../IDebugTools";
import { areArraysIdentical } from "../../util/Array";
import InspectInformationSection, { TabInformation } from "../component/InspectInformationSection";

export default class CorpseInformation extends InspectInformationSection {

	@Mod.log(DEBUG_TOOLS_ID)
	public readonly LOG: Log;

	private readonly resurrectButton: Button;

	private corpses: ICorpse[] = [];
	private corpse: ICorpse | undefined;

	public constructor(gsapi: IGameScreenApi) {
		super(gsapi);

		this.resurrectButton = new Button(this.api)
			.setText(translation(DebugToolsTranslation.ButtonResurrectCorpse))
			.on(ButtonEvent.Activate, this.resurrect)
			.appendTo(this);

		new Button(this.api)
			.setText(translation(DebugToolsTranslation.ButtonRemoveThing))
			.on(ButtonEvent.Activate, this.removeCorpse)
			.appendTo(this);
	}

	public getTabs(): TabInformation[] {
		return this.corpses.entries()
			.map(([i, corpse]) => tuple(i, () => translation(DebugToolsTranslation.CorpseName)
				.get(game.getName(corpse, SentenceCaseStyle.Title, false))))
			.collect(Collectors.toArray);
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
		Actions.get("heal").execute({ object: this.corpse!.id });
		this.trigger("update");
	}

	@Bound
	private removeCorpse() {
		Actions.get("remove").execute({ object: [RemovalType.Corpse, this.corpse!.id] });
		this.trigger("update");
	}
}
