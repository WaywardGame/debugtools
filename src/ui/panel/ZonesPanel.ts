import Mod from "@wayward/game/mod/Mod";
import ChoiceList, { Choice } from "@wayward/game/ui/component/ChoiceList";
import { Heading } from "@wayward/game/ui/component/Text";
import { OwnEventHandler } from "@wayward/utilities/event/EventManager";
import type DebugTools from "../../DebugTools";
import type { ISaveData } from "../../IDebugTools";
import { DebugToolsTranslation, translation } from "../../IDebugTools";
import { CreatureZoneOverlayMode } from "../../overlay/CreatureZoneOverlay";
import DebugToolsPanel from "../component/DebugToolsPanel";

export default class ZonesPanel extends DebugToolsPanel {

	@Mod.instance<DebugTools>("Debug Tools")
	public readonly DEBUG_TOOLS: DebugTools;

	@Mod.saveData<DebugTools>("Debug Tools")
	public saveData: ISaveData;

	public constructor() {
		super();

		new Heading()
			.setText(translation(DebugToolsTranslation.HeadingZonesOverlay))
			.appendTo(this);

		let defaultMode: Choice<CreatureZoneOverlayMode>;
		const overlayChoiceList = new ChoiceList<Choice<CreatureZoneOverlayMode>>()
			.setChoices(
				defaultMode = new Choice(CreatureZoneOverlayMode.None)
					.setText(translation(DebugToolsTranslation.None)),
				new Choice(CreatureZoneOverlayMode.Active)
					.setText(translation(DebugToolsTranslation.CreatureZoneOverlayModeActive)),
				new Choice(CreatureZoneOverlayMode.All)
					.setText(translation(DebugToolsTranslation.CreatureZoneOverlayModeAll)),
				new Choice(CreatureZoneOverlayMode.FollowingEntity)
					.setText(translation(DebugToolsTranslation.CreatureZoneOverlayModeFollowingEntity))
					.setDisabled(true, "can't set this manually"))
			.setRefreshMethod(list => list.choices(choice => choice.id === this.DEBUG_TOOLS.creatureZoneOverlay.getMode()).first() ?? defaultMode)
			.event.subscribe("choose", (_, choice) => this.DEBUG_TOOLS.creatureZoneOverlay.setMode(choice.id))
			.appendTo(this);

		this.DEBUG_TOOLS.creatureZoneOverlay.event.until(this, "remove")
			.subscribe("changeMode", () => overlayChoiceList.refresh());
	}

	public override getTranslation(): DebugToolsTranslation {
		return DebugToolsTranslation.PanelZones;
	}

	@OwnEventHandler(ZonesPanel, "switchTo")
	protected onSwitchTo(): void {
	}

}
