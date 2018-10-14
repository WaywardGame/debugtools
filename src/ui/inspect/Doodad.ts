import { IDoodad } from "doodad/IDoodad";
import { ItemQuality, ItemType } from "Enums";
import { TextContext } from "language/Translation";
import Mod from "mod/Mod";
import Button, { ButtonEvent } from "newui/component/Button";
import IGameScreenApi from "newui/screen/screens/game/IGameScreenApi";
import { ITile } from "tile/ITerrain";
import Log from "utilities/Log";
import { IVector2 } from "utilities/math/IVector";
import Vector3 from "utilities/math/Vector3";
import { Bound } from "utilities/Objects";
import Actions from "../../Actions";
import DebugTools from "../../DebugTools";
import { DEBUG_TOOLS_ID, DebugToolsTranslation, translation } from "../../IDebugTools";
import AddItemToInventory, { AddItemToInventoryEvent } from "../component/AddItemToInventory";
import { DebugToolsPanelEvent } from "../component/DebugToolsPanel";
import InspectInformationSection, { TabInformation } from "../component/InspectInformationSection";

export default class DoodadInformation extends InspectInformationSection {

	@Mod.instance<DebugTools>(DEBUG_TOOLS_ID)
	public readonly DEBUG_TOOLS: DebugTools;
	@Mod.log(DEBUG_TOOLS_ID)
	public readonly LOG: Log;

	private doodad: IDoodad | undefined;

	public constructor(gsapi: IGameScreenApi) {
		super(gsapi);

		new Button(this.api)
			.setText(translation(DebugToolsTranslation.ActionRemove))
			.on(ButtonEvent.Activate, this.removeDoodad)
			.appendTo(this);

		new Button(this.api)
			.setText(translation(DebugToolsTranslation.ButtonCloneEntity))
			.on(ButtonEvent.Activate, this.cloneDoodad)
			.appendTo(this);

		this.on(DebugToolsPanelEvent.SwitchTo, () => {
			if (!this.doodad!.containedItems) return;

			const addItemToInventory = AddItemToInventory.init(this.api).appendTo(this);
			this.until(DebugToolsPanelEvent.SwitchAway)
				.bind(addItemToInventory, AddItemToInventoryEvent.Execute, this.addItem);
		});
	}

	public getTabs(): TabInformation[] {
		return this.doodad ? [
			[0, () => translation(DebugToolsTranslation.DoodadName)
				.get(this.doodad!.getName(false).inContext(TextContext.Title))],
		] : [];
	}

	public update(position: IVector2, tile: ITile) {
		if (tile.doodad === this.doodad) return;
		this.doodad = tile.doodad;

		if (!this.doodad) return;

		this.setShouldLog();
	}

	public logUpdate() {
		this.LOG.info("Doodad:", this.doodad);
	}

	@Bound
	private addItem(_: any, type: ItemType, quality: ItemQuality) {
		Actions.get("addItemToInventory")
			.execute({ doodad: this.doodad, object: [type, quality] });
	}

	@Bound
	private removeDoodad() {
		Actions.get("remove").execute({ doodad: this.doodad });
	}

	@Bound
	private async cloneDoodad() {
		const teleportLocation = await this.DEBUG_TOOLS.selector.select();
		if (!teleportLocation) return;

		Actions.get("clone")
			.execute({ doodad: this.doodad, position: new Vector3(teleportLocation.x, teleportLocation.y, localPlayer.z) });
	}
}
