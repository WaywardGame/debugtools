import { EventBus } from "event/EventBuses";
import { EventHandler } from "event/EventManager";
import Translation from "language/Translation";
import Mod from "mod/Mod";
import ChoiceList, { Choice } from "ui/component/ChoiceList";
import Divider from "ui/component/Divider";
import { LabelledRow } from "ui/component/LabelledRow";
import Text, { Heading } from "ui/component/Text";
import DebugTools from "../../DebugTools";
import { DebugToolsTranslation, ISaveData, translation } from "../../IDebugTools";
import { TemperatureOverlayMode } from "../../overlay/TemperatureOverlay";
import DebugToolsPanel from "../component/DebugToolsPanel";
// import Component from "ui/component/Component";
// import Renderer from "renderer/Renderer";

export default class TemperaturePanel extends DebugToolsPanel {

	@Mod.instance<DebugTools>("Debug Tools")
	public readonly DEBUG_TOOLS: DebugTools;

	@Mod.saveData<DebugTools>("Debug Tools")
	public saveData: ISaveData;

	private biomeTimeModifier: Text;
	private layerTimeModifier: Text;

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

	public override getTranslation() {
		return DebugToolsTranslation.PanelTemperature;
	}

	@EventHandler(EventBus.LocalPlayer, "changeZ")
	@EventHandler(EventBus.LocalPlayer, "moveToIsland")
	protected onChangeArea() {
		ui.refreshTranslations(this);
	}

	@EventHandler(EventBus.Island, "tickEnd")
	protected onTime() {
		this.biomeTimeModifier.refresh();
		this.layerTimeModifier.refresh();
	}

}
