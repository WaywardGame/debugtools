import { ICorpse } from "creature/corpse/ICorpse";
import { CreatureType, SentenceCaseStyle } from "Enums";
import Button, { ButtonEvent } from "newui/component/Button";
import Component from "newui/component/Component";
import { Paragraph } from "newui/component/Text";
import { UiApi } from "newui/INewUi";
import { ITile } from "tile/ITerrain";
import { IVector2 } from "utilities/math/IVector";
import { Bound } from "utilities/Objects";
import Actions, { RemovalType } from "../../Actions";
import DebugTools, { translation } from "../../DebugTools";
import { DebugToolsTranslation } from "../../IDebugTools";
import { areArraysIdentical } from "../../util/Array";
import { IInspectInformationSection } from "../InspectDialog";

export default class CorpseInformation extends Component implements IInspectInformationSection {
	private corpses: ICorpse[] = [];
	public constructor(api: UiApi) {
		super(api);
	}

	public update(position: IVector2, tile: ITile) {
		const corpses = tile.corpses || [];
		this.toggle(!!corpses.length);

		if (areArraysIdentical(corpses, this.corpses)) return;
		this.corpses = corpses;

		this.dump();

		for (const corpse of corpses) {
			DebugTools.LOG.info("Corpse:", corpse);

			new Paragraph(this.api)
				.setText(() => translation(DebugToolsTranslation.CorpseName)
					.get(corpse.renamed, game.getName(corpse, SentenceCaseStyle.Title, true)))
				.appendTo(this);

			if (corpse.type !== CreatureType.Blood && corpse.type !== CreatureType.WaterBlood) {
				new Button(this.api)
					.setText(translation(DebugToolsTranslation.ButtonResurrectCorpse))
					.on(ButtonEvent.Activate, this.resurrect(corpse))
					.appendTo(this);
			}

			new Button(this.api)
				.setText(translation(DebugToolsTranslation.ButtonRemoveThing))
				.on(ButtonEvent.Activate, this.removeCorpse(corpse))
				.appendTo(this);
		}

		return this;
	}

	@Bound
	private resurrect(corpse: ICorpse) {
		return () => {
			actionManager.execute(localPlayer, Actions.get("heal"), { object: corpse.id });
			this.triggerSync("update");
		};
	}

	@Bound
	private removeCorpse(corpse: ICorpse) {
		return () => {
			actionManager.execute(localPlayer, Actions.get("remove"), { object: [RemovalType.Corpse, corpse.id] });
			this.triggerSync("update");
		};
	}
}
