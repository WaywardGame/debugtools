import Tile from "game/tile/Tile";
import Mod from "mod/Mod";
import { Bound } from "utilities/Decorators";
import Log from "utilities/Log";
import { DebugToolsTranslation, DEBUG_TOOLS_ID, translation } from "../../IDebugTools";
import Container from "../component/Container";
import InspectInformationSection, { TabInformation } from "../component/InspectInformationSection";


export default class ItemInformation extends InspectInformationSection {

	@Mod.log(DEBUG_TOOLS_ID)
	public readonly LOG: Log;

	private tile: Tile;

	public override getTabs(): TabInformation[] {
		return [
			[0, translation(DebugToolsTranslation.TabItemStack)],
		];
	}

	public override setTab() {
		Container.appendTo(this, this, this.getTile);
		return this;
	}

	public override update(tile: Tile) {
		this.tile = tile;
		Container.INSTANCE?.refreshItems();
		if (tile.containedItems?.length) {
			this.setShouldLog();
		}
	}

	public override logUpdate() {
		this.LOG.info("Items:", this.tile?.containedItems);
	}

	@Bound private getTile() {
		// todo: this might desync because it's creating a tile container?
		return this.tile.tileContainer;
	}
}
