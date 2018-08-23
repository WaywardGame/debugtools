import { IDoodad } from "doodad/IDoodad";
import { SentenceCaseStyle } from "Enums";
import { UiApi } from "newui/INewUi";
import { ITile } from "tile/ITerrain";
import { IVector2 } from "utilities/math/IVector";
import DebugTools, { translation } from "../../DebugTools";
import { DebugToolsTranslation } from "../../IDebugTools";
import InspectInformationSection, { TabInformation } from "../component/InspectInformationSection";

export default class DoodadInformation extends InspectInformationSection {
	private doodad: IDoodad | undefined;

	public constructor(api: UiApi) {
		super(api);
	}

	public getTabs(): TabInformation[] {
		return this.doodad ? [
			[0, () => translation(DebugToolsTranslation.DoodadName)
				.get(game.getName(this.doodad, SentenceCaseStyle.Title, false))],
		] : [];
	}

	public update(position: IVector2, tile: ITile) {
		if (tile.doodad === this.doodad) return;
		this.doodad = tile.doodad;

		if (this.doodad) {
			DebugTools.LOG.info("Doodad:", this.doodad);
		}

		return this;
	}
}
