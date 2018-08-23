import { SentenceCaseStyle } from "Enums";
import { UiApi } from "newui/INewUi";
import { ITile } from "tile/ITerrain";
import { ITileEvent } from "tile/ITileEvent";
import tileEventDescriptions from "tile/TileEvents";
import Collectors from "utilities/Collectors";
import { IVector2 } from "utilities/math/IVector";
import DebugTools, { translation } from "../../DebugTools";
import { DebugToolsTranslation } from "../../IDebugTools";
import InspectInformationSection, { TabInformation } from "../component/InspectInformationSection";

export default class TileEventInformation extends InspectInformationSection {
	private tileEvents: ITileEvent[] = [];
	// @ts-ignore
	private tileEvent: ITileEvent | undefined;

	public constructor(api: UiApi) {
		super(api);
	}

	public getTabs(): TabInformation[] {
		return this.tileEvents.entries()
			.map<TabInformation>(([i, tileEvent]) => [i, () => translation(DebugToolsTranslation.TileEventName)
				.get(game.getNameFromDescription(tileEventDescriptions[tileEvent.type]!, SentenceCaseStyle.Title, false))])
			.collect(Collectors.toArray);
	}

	public setTab(tileEvent: number) {
		this.tileEvent = this.tileEvents[tileEvent];
		return this;
	}

	public update(position: IVector2, tile: ITile) {
		this.tileEvents = tile.events || [];

		for (const tileEvent of this.tileEvents) {
			DebugTools.LOG.info("Tile Event:", tileEvent);
		}

		return this;
	}
}
