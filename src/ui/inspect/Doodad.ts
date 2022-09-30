import { OwnEventHandler } from "event/EventManager";
import Doodad from "game/doodad/Doodad";
import { GrowingStage } from "game/doodad/IDoodad";
import { Quality } from "game/IObject";
import { IContainer, ItemType } from "game/item/IItem";
import { ITile } from "game/tile/ITerrain";
import { TextContext } from "language/ITranslation";
import Translation from "language/Translation";
import Mod from "mod/Mod";
import Button from "ui/component/Button";
import EnumContextMenu, { EnumSort } from "ui/component/EnumContextMenu";
import { Bound } from "utilities/Decorators";
import Log from "utilities/Log";
import { IVector2 } from "utilities/math/IVector";
import Vector3 from "utilities/math/Vector3";
import AddItemToInventory from "../../action/AddItemToInventory";
import Clone from "../../action/Clone";
import Remove from "../../action/Remove";
import SetGrowingStage from "../../action/SetGrowingStage";
import DebugTools from "../../DebugTools";
import { DebugToolsTranslation, DEBUG_TOOLS_ID, translation } from "../../IDebugTools";
import AddItemToInventoryComponent from "../component/AddItemToInventory";
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

		const addItemToInventory = AddItemToInventoryComponent.init().appendTo(this);
		addItemToInventory.event.until(this, "switchAway", "remove")
			.subscribe("execute", this.addItem);
	}

	public override getTabs(): TabInformation[] {
		return this.doodad ? [
			[0, () => translation(DebugToolsTranslation.DoodadName)
				.get(this.doodad!.getName(false).inContext(TextContext.Title))],
		] : [];
	}

	public override update(position: IVector2, tile: ITile) {
		if (tile.doodad === this.doodad) return;
		this.doodad = tile.doodad;

		if (!this.doodad) return;

		this.buttonGrowthStage.toggle(this.doodad.getGrowingStage() !== undefined);

		this.setShouldLog();
	}

	public override logUpdate() {
		this.LOG.info("Doodad:", this.doodad);
	}

	@Bound
	private addItem(_: any, type: ItemType, quality: Quality, quantity: number) {
		AddItemToInventory.execute(localPlayer, this.doodad! as IContainer, type, quality, quantity);
	}

	@Bound
	private removeDoodad() {
		Remove.execute(localPlayer, this.doodad!);
	}

	@Bound
	private async cloneDoodad() {
		const teleportLocation = await this.DEBUG_TOOLS.selector.select();
		if (!teleportLocation) return;

		Clone.execute(localPlayer, this.doodad!, new Vector3(teleportLocation, localPlayer.z));
	}

	@Bound
	private async setGrowthStage() {
		const growthStage = await new EnumContextMenu(GrowingStage)
			.setTranslator(stage => Translation.growthStage(stage, this.doodad!.description()?.usesSpores)!.inContext(TextContext.Title))
			.setSort(EnumSort.Id)
			.waitForChoice();

		if (growthStage === undefined) {
			return;
		}

		SetGrowingStage.execute(localPlayer, this.doodad!, growthStage);
	}
}
