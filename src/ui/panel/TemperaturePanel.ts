import { EventBus } from "@wayward/game/event/EventBuses";
import { EventHandler } from "@wayward/game/event/EventManager";
import Translation from "@wayward/game/language/Translation";
import Mod from "@wayward/game/mod/Mod";
import ChoiceList, { Choice } from "@wayward/game/ui/component/ChoiceList";
import Divider from "@wayward/game/ui/component/Divider";
import { LabelledRow } from "@wayward/game/ui/component/LabelledRow";
import Text, { Heading } from "@wayward/game/ui/component/Text";
import type DebugTools from "../../DebugTools";
import type { ISaveData } from "../../IDebugTools";
import { DebugToolsTranslation, translation } from "../../IDebugTools";
import { TemperatureOverlayMode } from "../../overlay/TemperatureOverlay";
import DebugToolsPanel from "../component/DebugToolsPanel";
// import Component from "@wayward/game/ui/component/Component";
// import Renderer from "@wayward/game/renderer/Renderer";

export default class TemperaturePanel extends DebugToolsPanel {

	@Mod.instance<DebugTools>("Debug Tools")
	public readonly DEBUG_TOOLS: DebugTools;

	@Mod.saveData<DebugTools>("Debug Tools")
	public saveData: ISaveData;

	private readonly biomeTimeModifier: Text;
	private readonly layerTimeModifier: Text;
	private readonly modTimeModifier: Text;

	public constructor() {
		super();

		new LabelledRow()
			.setLabel(label => label.setText(translation(DebugToolsTranslation.InspectionTemperatureBiome)
				.passTo(Translation.colorizeImportance("secondary"))))
			.append(new Text().setText(Translation.colorizeImportance("primary")
				.addArgs(() => localIsland.temperature.getBiomeBase())))
			.appendTo(this);

		new LabelledRow()
			.setLabel(label => label.setText(translation(DebugToolsTranslation.InspectionTemperatureBiomeTimeModifier)
				.passTo(Translation.colorizeImportance("secondary"))))
			.append(this.biomeTimeModifier = new Text().setText(Translation.colorizeImportance("primary")
				.addArgs(() => localIsland.temperature.getBiomeTimeModifier())))
			.appendTo(this);

		new LabelledRow()
			.setLabel(label => label.setText(translation(DebugToolsTranslation.InspectionTemperatureLayerModifier)
				.passTo(Translation.colorizeImportance("secondary"))))
			.append(new Text().setText(Translation.colorizeImportance("primary")
				.addArgs(() => localIsland.temperature.getLayerBase(localPlayer.z))))
			.appendTo(this);

		new LabelledRow()
			.setLabel(label => label.setText(translation(DebugToolsTranslation.InspectionTemperatureLayerTimeModifier)
				.passTo(Translation.colorizeImportance("secondary"))))
			.append(this.layerTimeModifier = new Text().setText(Translation.colorizeImportance("primary")
				.addArgs(() => localIsland.temperature.getLayerTimeModifier(localPlayer.z))))
			.appendTo(this);

		new LabelledRow()
			.setLabel(label => label.setText(translation(DebugToolsTranslation.InspectionTemperatureLayerInjectModifier)
				.passTo(Translation.colorizeImportance("secondary"))))
			.append(this.modTimeModifier = new Text().setText(Translation.colorizeImportance("primary")
				.addArgs(() => localIsland.temperature.getTempModifier(localIsland.biomeType, localPlayer.z))))
			.appendTo(this);

		new Divider()
			.appendTo(this);

		new Heading()
			.setText(translation(DebugToolsTranslation.HeadingTemperatureOverlay))
			.appendTo(this);

		let defaultMode: Choice<TemperatureOverlayMode>;
		new ChoiceList<Choice<TemperatureOverlayMode>>()
			.setChoices(
				defaultMode = new Choice(TemperatureOverlayMode.None)
					.setText(translation(DebugToolsTranslation.None)),
				new Choice(TemperatureOverlayMode.Produced)
					.setText(translation(DebugToolsTranslation.TemperatureOverlayModeProduced)),
				new Choice(TemperatureOverlayMode.Calculated)
					.setText(translation(DebugToolsTranslation.TemperatureOverlayModeCalculated)))
			.setRefreshMethod(list => list.choices(choice => choice.id === this.DEBUG_TOOLS.temperatureOverlay.getMode()).first() ?? defaultMode)
			.event.subscribe("choose", (_, choice) => this.DEBUG_TOOLS.temperatureOverlay.setMode(choice.id))
			.appendTo(this);
	}

	public override getTranslation(): DebugToolsTranslation {
		return DebugToolsTranslation.PanelTemperature;
	}

	@EventHandler(EventBus.LocalPlayer, "changeZ")
	@EventHandler(EventBus.LocalPlayer, "moveToIsland")
	protected onChangeArea(): void {
		ui.refreshTranslations(this);
	}

	@EventHandler(EventBus.Island, "tickEnd")
	protected onTime(): void {
		this.biomeTimeModifier.refresh();
		this.layerTimeModifier.refresh();
		this.modTimeModifier.refresh();
	}

}
