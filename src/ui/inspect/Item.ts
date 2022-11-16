import { ITile } from "game/tile/ITerrain";
import Mod from "mod/Mod";
import { Bound } from "utilities/Decorators";
import Log from "utilities/Log";
import { IVector2 } from "utilities/math/IVector";
import { DebugToolsTranslation, DEBUG_TOOLS_ID, translation } from "../../IDebugTools";
import Container from "../component/Container";
import InspectInformationSection, { TabInformation } from "../component/InspectInformationSection";


export default class ItemInformation extends InspectInformationSection {

	@Mod.log(DEBUG_TOOLS_ID)
	public readonly LOG: Log;

	private position: IVector2;

	public override getTabs(): TabInformation[] {
		return [
			[0, translation(DebugToolsTranslation.TabItemStack)],
		];
	}

	public override setTab() {
		Container.appendTo(this, this, this.getTile);
		return this;
	}

	public override update(position: IVector2, tile: ITile) {
		this.position = position;
		Container.INSTANCE?.refreshItems();
		if (tile.containedItems?.length)
			this.setShouldLog();
	}

	public override logUpdate() {
		this.LOG.info("Items:", this.getTile()?.containedItems);
	}

	@Bound private getTile() {
		return localIsland.items.getTileContainer(this.position.x, this.position.y, localPlayer.z);
	}
}
