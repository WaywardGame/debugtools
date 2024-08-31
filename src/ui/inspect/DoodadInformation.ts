import Doodad from "@wayward/game/game/doodad/Doodad";
import { GrowingStage } from "@wayward/game/game/doodad/IDoodad";
import { IContainer } from "@wayward/game/game/item/IItem";
import Tile from "@wayward/game/game/tile/Tile";
import { TextContext } from "@wayward/game/language/ITranslation";
import Translation, { Article } from "@wayward/game/language/Translation";
import Mod from "@wayward/game/mod/Mod";
import Button from "@wayward/game/ui/component/Button";
import EnumContextMenu, { EnumSort } from "@wayward/game/ui/component/EnumContextMenu";
import { Bound } from "@wayward/utilities/Decorators";
import Log from "@wayward/utilities/Log";
import { OwnEventHandler } from "@wayward/utilities/event/EventManager";
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

	protected doodad: Doodad | undefined;
	protected readonly buttonGrowthStage: Button;
	protected container?: Container;

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
	protected async onSwitchTo(): Promise<void> {
		if (!this.doodad!.containedItems)
			return;

		this.container?.remove();
		this.container = await Container.appendTo(this, this, () => this.doodad as IContainer);
	}

	public override getTabs(): TabInformation[] {
		return this.doodad ? [
			[0, () => translation(DebugToolsTranslation.DoodadName)
				.get(this.doodad!.getName(Article.None).inContext(TextContext.Title))],
		] : [];
	}

	public override update(tile: Tile): void {
		if (tile.doodad === this.doodad) return;
		this.doodad = tile.doodad;

		if (!this.doodad) return;

		this.buttonGrowthStage.toggle(this.doodad.growth !== undefined);

		this.setShouldLog();
	}

	public override logUpdate(): void {
		this.LOG.info("Doodad:", this.doodad);
	}

	@Bound
	private removeDoodad(): void {
		Remove.execute(localPlayer, this.doodad!);
	}

	@Bound
	private async cloneDoodad(): Promise<void> {
		const teleportLocation = await this.DEBUG_TOOLS.selector.select();
		if (!teleportLocation) return;

		Clone.execute(localPlayer, this.doodad!, teleportLocation);
	}

	@Bound
	private async setGrowthStage(): Promise<void> {
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
