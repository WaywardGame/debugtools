import type { ITileContainer } from "@wayward/game/game/tile/ITerrain";
import type Tile from "@wayward/game/game/tile/Tile";
import Mod from "@wayward/game/mod/Mod";
import { Bound } from "@wayward/utilities/Decorators";
import type Log from "@wayward/utilities/Log";
import { DEBUG_TOOLS_ID, DebugToolsTranslation, translation } from "../../IDebugTools";
import Container from "../component/Container";
import type { TabInformation } from "../component/InspectInformationSection";
import InspectInformationSection from "../component/InspectInformationSection";
import ConsoleUtility from "@wayward/utilities/console/ConsoleUtility";

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
		void Container.appendTo(this, this, this.getTile).then(container => this.container = container);
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
		ConsoleUtility.magic.$$items(this, me => me?.tile.containedItems);
		this.LOG.info("$$items:", this.tile?.containedItems?.map(item => item["debug"]));
	}

	@Bound private getTile(): ITileContainer {
		// todo: this might desync because it's creating a tile container?
		return this.tile.tileContainer;
	}
}
