import Component from "newui/component/Component";
import { UiApi } from "newui/INewUi";
import { ITile } from "tile/ITerrain";
import { IVector2 } from "utilities/math/IVector";
import DebugTools from "../../DebugTools";
import { IInspectInformationSection } from "../InspectDialog";

export default class TileEventInformation extends Component implements IInspectInformationSection {
	public constructor(api: UiApi) {
		super(api);
	}

	public update(position: IVector2, tile: ITile) {
		const tileEvents = tile.events || [];
		this.toggle(!!tileEvents.length);

		for (const tileEvent of tileEvents) {
			DebugTools.LOG.info("Tile Event:", tileEvent);
		}

		return this;
	}
}
