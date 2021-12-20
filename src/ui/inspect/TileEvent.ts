import { ITile } from "game/tile/ITerrain";
import TileEvent from "game/tile/TileEvent";
import Dictionary from "language/Dictionary";
import { TextContext } from "language/ITranslation";
import Translation from "language/Translation";
import Mod from "mod/Mod";
import Button from "ui/component/Button";
import { Tuple } from "utilities/collection/Arrays";
import { Bound } from "utilities/Decorators";
import Log from "utilities/Log";
import { IVector2 } from "utilities/math/IVector";
import Remove from "../../action/Remove";
import { DebugToolsTranslation, DEBUG_TOOLS_ID, translation } from "../../IDebugTools";
import { areArraysIdentical } from "../../util/Array";
import InspectInformationSection, { TabInformation } from "../component/InspectInformationSection";


export default class TileEventInformation extends InspectInformationSection {

	@Mod.log(DEBUG_TOOLS_ID)
	public readonly LOG: Log;

	private tileEvents: TileEvent[] = [];
	// @ts-ignore
	private tileEvent: TileEvent | undefined;

	public constructor() {
		super();

		new Button()
			.setText(translation(DebugToolsTranslation.ActionRemove))
			.event.subscribe("activate", this.removeTileEvent)
			.appendTo(this);
	}

	public override getTabs(): TabInformation[] {
		return this.tileEvents.entries().stream()
			.map(([i, tileEvent]) => Tuple(i, () => translation(DebugToolsTranslation.TileEventName)
				.get(Translation.nameOf(Dictionary.TileEvent, tileEvent, false).inContext(TextContext.Title))))
			.toArray();
	}

	public override setTab(tileEvent: number) {
		this.tileEvent = this.tileEvents[tileEvent];
		return this;
	}

	public override update(position: IVector2, tile: ITile) {
		const tileEvents = [...tile.events || []];

		if (areArraysIdentical(tileEvents, this.tileEvents)) return;
		this.tileEvents = tileEvents;

		this.setShouldLog();
	}

	public override logUpdate() {
		for (const tileEvent of this.tileEvents) {
			this.LOG.info("Tile Event:", tileEvent);
		}
	}

	@Bound
	private removeTileEvent() {
		Remove.execute(localPlayer, this.tileEvent!);
	}
}
