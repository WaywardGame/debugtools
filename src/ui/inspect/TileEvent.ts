import { SentenceCaseStyle } from "Enums";
import Button, { ButtonEvent } from "newui/component/Button";
import { UiApi } from "newui/INewUi";
import { ITile } from "tile/ITerrain";
import { ITileEvent } from "tile/ITileEvent";
import tileEventDescriptions from "tile/TileEvents";
import { tuple } from "utilities/Arrays";
import Collectors from "utilities/Collectors";
import { IVector2 } from "utilities/math/IVector";
import { Bound } from "utilities/Objects";
import Actions, { RemovalType } from "../../Actions";
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

		new Button(api)
			.setText(translation(DebugToolsTranslation.ActionRemove))
			.on(ButtonEvent.Activate, this.removeTileEvent)
			.appendTo(this);
	}

	public getTabs(): TabInformation[] {
		return this.tileEvents.entries()
			.map(([i, tileEvent]) => tuple(i, () => translation(DebugToolsTranslation.TileEventName)
				.get(game.getNameFromDescription(tileEventDescriptions[tileEvent.type]!, SentenceCaseStyle.Title, false))))
			.collect(Collectors.toArray);
	}

	public setTab(tileEvent: number) {
		this.tileEvent = this.tileEvents[tileEvent];
		return this;
	}

	public update(position: IVector2, tile: ITile) {
		const tileEvents = [...tile.events || []];

		if (areArraysIdentical(tileEvents, this.tileEvents)) return;
		this.tileEvents = tileEvents;

		this.setShouldLog();
	}

	public logUpdate() {
		for (const tileEvent of this.tileEvents) {
			DebugTools.LOG.info("Tile Event:", tileEvent);
		}
	}

	@Bound
	private removeTileEvent() {
		Actions.get("remove")
			.execute({ object: [RemovalType.TileEvent, this.tileEvent!.id] });
	}
}
