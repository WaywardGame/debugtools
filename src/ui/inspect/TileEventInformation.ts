/*!
 * Copyright 2011-2023 Unlok
 * https://www.unlok.ca
 *
 * Credits & Thanks:
 * https://www.unlok.ca/credits-thanks/
 *
 * Wayward is a copyrighted and licensed work. Modification and/or distribution of any source files is prohibited. If you wish to modify the game in any way, please refer to the modding guide:
 * https://github.com/WaywardGame/types/wiki
 */

import Tile from "game/tile/Tile";
import TileEvent from "game/tile/TileEvent";
import Dictionary from "language/Dictionary";
import { TextContext } from "language/ITranslation";
import Translation, { Article } from "language/Translation";
import Mod from "mod/Mod";
import Button from "ui/component/Button";
import { Bound } from "utilities/Decorators";
import Log from "utilities/Log";
import { Tuple } from "utilities/collection/Tuple";
import { DEBUG_TOOLS_ID, DebugToolsTranslation, translation } from "../../IDebugTools";
import Remove from "../../action/Remove";
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
				.get(Translation.nameOf(Dictionary.TileEvent, tileEvent, Article.None).inContext(TextContext.Title))))
			.toArray();
	}

	public override setTab(tileEvent: number) {
		this.tileEvent = this.tileEvents[tileEvent];
		return this;
	}

	public override update(tile: Tile) {
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
