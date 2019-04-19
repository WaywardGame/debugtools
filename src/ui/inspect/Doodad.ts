import Doodad from "doodad/doodads/Doodad";
import { GrowingStage, IDoodad } from "doodad/IDoodad";
import ActionExecutor from "entity/action/ActionExecutor";
import { EventHandler } from "event/EventManager";
import { Quality } from "game/IObject";
import { IContainer, ItemType } from "item/IItem";
import { TextContext } from "language/Translation";
import Mod from "mod/Mod";
import Button from "newui/component/Button";
import EnumContextMenu, { EnumSort } from "newui/component/EnumContextMenu";
import { ITile } from "tile/ITerrain";
import Log from "utilities/Log";
import { IVector2 } from "utilities/math/IVector";
import Vector3 from "utilities/math/Vector3";

import AddItemToInventory from "../../action/AddItemToInventory";
import Clone from "../../action/Clone";
import Remove from "../../action/Remove";
import SetGrowingStage from "../../action/SetGrowingStage";
import DebugTools from "../../DebugTools";
import { DEBUG_TOOLS_ID, DebugToolsTranslation, translation } from "../../IDebugTools";
import AddItemToInventoryComponent from "../component/AddItemToInventory";
import InspectInformationSection, { TabInformation } from "../component/InspectInformationSection";

export default class DoodadInformation extends InspectInformationSection {

	@Mod.instance<DebugTools>(DEBUG_TOOLS_ID)
	public readonly DEBUG_TOOLS: DebugTools;
	@Mod.log(DEBUG_TOOLS_ID)
	public readonly LOG: Log;

	private doodad: IDoodad | undefined;
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

	@EventHandler<DoodadInformation>("self")("switchTo")
	protected onSwitchTo() {
		if (!this.doodad!.containedItems)
			return;

		const addItemToInventory = AddItemToInventoryComponent.init().appendTo(this);
		addItemToInventory.event.until(this, "switchAway")
			.subscribe("execute", this.addItem);
	}

	@Override public getTabs(): TabInformation[] {
		return this.doodad ? [
			[0, () => translation(DebugToolsTranslation.DoodadName)
				.get(this.doodad!.getName(false).inContext(TextContext.Title))],
		] : [];
	}

	@Override public update(position: IVector2, tile: ITile) {
		if (tile.doodad === this.doodad) return;
		this.doodad = tile.doodad;

		if (!this.doodad) return;

		this.buttonGrowthStage.toggle(this.doodad.getGrowingStage() !== undefined);

		this.setShouldLog();
	}

	@Override public logUpdate() {
		this.LOG.info("Doodad:", this.doodad);
	}

	@Bound
	private addItem(_: any, type: ItemType, quality: Quality) {
		ActionExecutor.get(AddItemToInventory).execute(localPlayer, this.doodad! as IContainer, type, quality);
	}

	@Bound
	private removeDoodad() {
		ActionExecutor.get(Remove).execute(localPlayer, this.doodad!);
	}

	@Bound
	private async cloneDoodad() {
		const teleportLocation = await this.DEBUG_TOOLS.selector.select();
		if (!teleportLocation) return;

		ActionExecutor.get(Clone).execute(localPlayer, this.doodad!, new Vector3(teleportLocation, localPlayer.z));
	}

	@Bound
	private async setGrowthStage() {
		const growthStage = await new EnumContextMenu(GrowingStage)
			.setTranslator(stage => Doodad.getGrowingStageTranslation(stage, this.doodad!.description())!.inContext(TextContext.Title))
			.setSort(EnumSort.Id)
			.waitForChoice();

		if (growthStage === undefined) {
			return;
		}

		ActionExecutor.get(SetGrowingStage).execute(localPlayer, this.doodad!, growthStage);
	}
}
