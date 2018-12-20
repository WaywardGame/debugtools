import ActionExecutor from "action/ActionExecutor";
import { Dictionary } from "language/Dictionaries";
import Translation, { TextContext } from "language/Translation";
import Mod from "mod/Mod";
import Button, { ButtonEvent } from "newui/component/Button";
import IGameScreenApi from "newui/screen/screens/game/IGameScreenApi";
import { ITile } from "tile/ITerrain";
import { ITileEvent } from "tile/ITileEvent";
import Collectors from "utilities/iterable/Collectors";
import { tuple } from "utilities/iterable/Generators";
import Log from "utilities/Log";
import { IVector2 } from "utilities/math/IVector";
import { Bound } from "utilities/Objects";
import Remove from "../../action/Remove";
import { DEBUG_TOOLS_ID, DebugToolsTranslation, translation } from "../../IDebugTools";
import { areArraysIdentical } from "../../util/Array";
import InspectInformationSection, { TabInformation } from "../component/InspectInformationSection";

export default class TileEventInformation extends InspectInformationSection {

	@Mod.log(DEBUG_TOOLS_ID)
	public readonly LOG: Log;

	private tileEvents: ITileEvent[] = [];
	// @ts-ignore
	private tileEvent: ITileEvent | undefined;

	public constructor(gsapi: IGameScreenApi) {
		super(gsapi);

		new Button(this.api)
			.setText(translation(DebugToolsTranslation.ActionRemove))
			.on(ButtonEvent.Activate, this.removeTileEvent)
			.appendTo(this);
	}

	public getTabs(): TabInformation[] {
		return this.tileEvents.entries()
			.map(([i, tileEvent]) => tuple(i, () => translation(DebugToolsTranslation.TileEventName)
				.get(Translation.nameOf(Dictionary.TileEvent, tileEvent, false).inContext(TextContext.Title))))
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
			this.LOG.info("Tile Event:", tileEvent);
		}
	}

	@Bound
	private removeTileEvent() {
		ActionExecutor.get(Remove).execute(localPlayer, this.tileEvent!);
	}
}
