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

import { OwnEventHandler } from "event/EventManager";
import Doodad from "game/doodad/Doodad";
import { GrowingStage } from "game/doodad/IDoodad";
import { IContainer } from "game/item/IItem";
import Tile from "game/tile/Tile";
import { TextContext } from "language/ITranslation";
import Translation, { Article } from "language/Translation";
import Mod from "mod/Mod";
import Button from "ui/component/Button";
import EnumContextMenu, { EnumSort } from "ui/component/EnumContextMenu";
import { Bound } from "utilities/Decorators";
import Log from "utilities/Log";
import DebugTools from "../../DebugTools";
import { DEBUG_TOOLS_ID, DebugToolsTranslation, translation } from "../../IDebugTools";
import Clone from "../../action/Clone";
import Remove from "../../action/Remove";
import SetGrowingStage from "../../action/SetGrowingStage";
import Container from "../component/Container";
import InspectInformationSection, { TabInformation } from "../component/InspectInformationSection";

export default class DoodadInformation extends InspectInformationSection {

	@Mod.instance<DebugTools>(DEBUG_TOOLS_ID)
	public readonly DEBUG_TOOLS: DebugTools;
	@Mod.log(DEBUG_TOOLS_ID)
	public readonly LOG: Log;

	private doodad: Doodad | undefined;
	private readonly buttonGrowthStage: Button;

	public constructor() {
		super();

		new Button()
			.setText(translation(DebugToolsTranslation.ActionRemove))
			.event.subscribe("activate", this.removeDoodad)
			.appendTo(this);

		new Button()
			.setText(translation(DebugToolsTranslation.ButtonCloneEntity))
			.event.subscribe("activate", this.cloneDoodad)
			.appendTo(this);

		this.buttonGrowthStage = new Button()
			.setText(translation(DebugToolsTranslation.ButtonSetGrowthStage))
			.event.subscribe("activate", this.setGrowthStage)
			.appendTo(this);
	}

	@OwnEventHandler(DoodadInformation, "switchTo")
	protected onSwitchTo() {
		if (!this.doodad!.containedItems)
			return;

		Container.appendTo(this, this, () => this.doodad as IContainer);
	}

	public override getTabs(): TabInformation[] {
		return this.doodad ? [
			[0, () => translation(DebugToolsTranslation.DoodadName)
				.get(this.doodad!.getName(Article.None).inContext(TextContext.Title))],
		] : [];
	}

	public override update(tile: Tile) {
		if (tile.doodad === this.doodad) return;
		this.doodad = tile.doodad;

		if (!this.doodad) return;

		this.buttonGrowthStage.toggle(this.doodad.growth !== undefined);

		this.setShouldLog();
	}

	public override logUpdate() {
		this.LOG.info("Doodad:", this.doodad);
	}

	@Bound
	private removeDoodad() {
		Remove.execute(localPlayer, this.doodad!);
	}

	@Bound
	private async cloneDoodad() {
		const teleportLocation = await this.DEBUG_TOOLS.selector.select();
		if (!teleportLocation) return;

		Clone.execute(localPlayer, this.doodad!, teleportLocation);
	}

	@Bound
	private async setGrowthStage() {
		const growthStage = await new EnumContextMenu(GrowingStage)
			.setTranslator(stage => Translation.growthStage(stage, this.doodad!.description?.usesSpores)!.inContext(TextContext.Title))
			.setSort(EnumSort.Id)
			.waitForChoice();

		if (growthStage === undefined) {
			return;
		}

		SetGrowingStage.execute(localPlayer, this.doodad!, growthStage);
	}
}
