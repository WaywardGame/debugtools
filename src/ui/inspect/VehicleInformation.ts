/*!
 * Copyright 2011-2024 Unlok
 * https://www.unlok.ca
 *
 * Credits & Thanks:
 * https://www.unlok.ca/credits-thanks/
 *
 * Wayward is a copyrighted and licensed work. Modification and/or distribution of any source files is prohibited. If you wish to modify the game in any way, please refer to the modding guide:
 * https://github.com/WaywardGame/types/wiki
 */

import Tile from "@wayward/game/game/tile/Tile";
import { TextContext } from "@wayward/game/language/ITranslation";
import { Article } from "@wayward/game/language/Translation";
import DoodadInformation from "./DoodadInformation";
import { translation, DebugToolsTranslation } from "../../IDebugTools";
import { TabInformation } from "../component/InspectInformationSection";

export default class VehicleInformation extends DoodadInformation {

	public override getTabs(): TabInformation[] {
		return this.doodad ? [
			[0, () => translation(DebugToolsTranslation.VehicleName)
				.get(this.doodad!.getName(Article.None).inContext(TextContext.Title))],
		] : [];
	}

	public override update(tile: Tile): void {
		if (tile.vehicle === this.doodad) return;
		this.doodad = tile.vehicle;

		if (!this.doodad) return;

		this.buttonGrowthStage.hide();

		this.setShouldLog();
	}

	public override logUpdate(): void {
		this.LOG.info("Vehicle:", this.doodad);
	}

}
