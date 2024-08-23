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

import { ITileContainer } from "@wayward/game/game/tile/ITerrain";
import Tile from "@wayward/game/game/tile/Tile";
import Mod from "@wayward/game/mod/Mod";
import { Bound } from "@wayward/utilities/Decorators";
import Log from "@wayward/utilities/Log";
import { DEBUG_TOOLS_ID, DebugToolsTranslation, translation } from "../../IDebugTools";
import Container from "../component/Container";
import InspectInformationSection, { TabInformation } from "../component/InspectInformationSection";


export default class ItemInformation extends InspectInformationSection {

	@Mod.log(DEBUG_TOOLS_ID)
	public readonly LOG: Log;

	private tile: Tile;
	private container?: Container;

	public override getTabs(): TabInformation[] {
		return [
			[0, translation(DebugToolsTranslation.TabItemStack)],
		];
	}

	public override setTab(): this {
		this.container?.remove();
		Container.appendTo(this, this, this.getTile).then(container => this.container = container);
		return this;
	}

	public override update(tile: Tile): void {
		this.tile = tile;
		this.container?.refreshItems();
		if (tile.containedItems?.length) {
			this.setShouldLog();
		}
	}

	public override logUpdate(): void {
		this.LOG.info("Items:", this.tile?.containedItems);
	}

	@Bound private getTile(): ITileContainer {
		// todo: this might desync because it's creating a tile container?
		return this.tile.tileContainer;
	}
}
