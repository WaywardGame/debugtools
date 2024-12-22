import type Tile from "@wayward/game/game/tile/Tile";
import { TextContext } from "@wayward/game/language/ITranslation";
import { Article } from "@wayward/game/language/Translation";
import DoodadInformation from "./DoodadInformation";
import { translation, DebugToolsTranslation } from "../../IDebugTools";
import type { TabInformation } from "../component/InspectInformationSection";

export default class VehicleInformation extends DoodadInformation {

	public override getTabs(): TabInformation[] {
		return this.doodad ? [
			[0, () => translation(DebugToolsTranslation.VehicleName)
				.get(this.doodad!.getName(Article.None).inContext(TextContext.Title))],
		] : [];
	}

	public override update(tile: Tile): void {
		if (tile.vehicle === this.doodad) {
			return;
		}

		this.doodad = tile.vehicle;

		if (!this.doodad) {
			return;
		}

		this.buttonGrowthStage.hide();

		this.setShouldLog();
	}

	public override logUpdate(): void {
		this.LOG.info("Vehicle:", this.doodad?.["debug"]);
	}

}
