import { SentenceCaseStyle } from "Enums";
import { UiApi } from "newui/INewUi";
import { ITile } from "tile/ITerrain";
import { ITileEvent } from "tile/ITileEvent";
import tileEventDescriptions from "tile/TileEvents";
import Collectors from "utilities/Collectors";
import { IVector2 } from "utilities/math/IVector";
import DebugTools, { translation } from "../../DebugTools";
import { DebugToolsTranslation } from "../../IDebugTools";
import { areArraysIdentical } from "../../util/Array";
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
		const tileEvents = tile.events || [];

		if (areArraysIdentical(tileEvents, this.tileEvents)) return;
		this.tileEvents = tileEvents;

		this.setShouldLog();

		return this;
	}

	public logUpdate() {
		for (const tileEvent of this.tileEvents) {
			DebugTools.LOG.info("Tile Event:", tileEvent);
		}
	}
}
